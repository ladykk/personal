import { env } from "@/env";
import { TAccessControl } from "@/static/r2";
import S3 from "aws-sdk/clients/s3";
import { getServerAuthSession } from "./auth";
import { db } from "../db";
import { files } from "../db/schema/storage";
import { z } from "zod";
import { getAppUrl } from "@/lib/url";
import { eq } from "drizzle-orm";
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

export class R2 {
  private client: S3;
  private bucket: string;

  constructor() {
    this.client = new S3({
      endpoint: env.R2_API_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      signatureVersion: "v4",
      region: "auto",
    });
    this.bucket = env.R2_BUCKET;
  }

  public async getObject(key: string): Promise<BodyInit | null> {
    try {
      const result = await this.client
        .getObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();
      return result.Body as BodyInit;
    } catch (err) {
      return null;
    }
  }

  public async deleteObject(key: string): Promise<boolean> {
    try {
      await this.client
        .deleteObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();
      return true;
    } catch (err) {
      return false;
    }
  }

  public async uploadObject(key: string, file: Blob): Promise<string | null> {
    try {
      await this.client
        .putObject({
          Bucket: this.bucket,
          Key: key,
          Body: Buffer.from(await file.arrayBuffer()),
        })
        .promise();
      return key;
    } catch (err) {
      console.log(`[R2]: Failed to upload object. ${err}`);
      return null;
    }
  }
}

export const checkAccessControl = async (accessControl: TAccessControl) => {
  const unknownRule = String(accessControl.rule);
  switch (accessControl.rule) {
    case "public":
      return true;
    case "self":
      const session = await getServerAuthSession();
      if (!session) return false;
      if (session.user.id === accessControl.selfUserId) return true;
      return false;
    default:
      console.log(`[R2]: Not implemented access control rule. ${unknownRule}`);
      return false;
  }
};

export const generatePresignedUrlInputSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
});

export type TGeneratePresignedUrlInput = z.infer<
  typeof generatePresignedUrlInputSchema
>;

export const generatePresignedUrl = async (
  issuedBy: string,
  readAccessControl: TAccessControl,
  writeAccessControl: TAccessControl,
  options: TGeneratePresignedUrlInput
) => {
  const extenstion = options.fileName.split(".").pop();
  const result = await db
    .insert(files)
    .values({
      ...options,
      id: `${crypto.randomUUID()}.${extenstion}`,
      issuedBy: issuedBy,
      issuedAt: new Date(),
      readAccessControl: readAccessControl,
      writeAccessControl: writeAccessControl,
    })
    .returning({
      key: files.id,
    })
    .execute();

  return result[0].key;
};

export const deleteFileByUrl = async (url: string) => {
  const baseStorageUrl = getAppUrl(env.ROOT_DOMAIN, "storage", "/file");

  // Skip if the url is not a storage url
  if (!url.startsWith(baseStorageUrl)) return;

  const key = url.replace(baseStorageUrl, "");

  // Get file from database
  const file = await db.query.files
    .findFirst({
      where: ({ id }, { eq }) => eq(id, key),
    })
    .execute();

  if (!file) {
    console.log(`[R2]: File not found in DB. Skip delete. ${key}`);
    return;
  }

  // Check access control
  const isAuthorized = await checkAccessControl(file.writeAccessControl);

  // If not authorized, return 401
  if (!isAuthorized)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Unauthorized",
      }),
      {
        status: 401,
      }
    );

  // Delete file from R2
  const r2 = new R2();
  const result = await r2.deleteObject(file.id);

  // If file not found, return 404
  if (!result) {
    console.log(`[R2]: File not found in R2. ${key}`);
  }

  // Delete file from database
  await db.delete(files).where(eq(files.id, file.id)).execute();

  // Return success
  return;
};
