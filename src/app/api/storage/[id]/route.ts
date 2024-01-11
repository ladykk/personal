import { env } from "@/env";
import dayjs from "@/lib/dayjs";
import { db } from "@/server/db";
import { files } from "@/server/db/schema/storage";
import { R2, checkAccessControl } from "@/server/services/r2";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

type Props = {
  params: {
    id: string;
  };
};

// GET /api/storage/[id]
export const GET = async (req: NextRequest, props: Props) => {
  // Search Params
  const cache = z
    .enum(["true", "false"])
    .parse(req.nextUrl.searchParams.get("cache") ?? "true");

  // Get file from database
  const file = await db.query.files
    .findFirst({
      where: ({ id }, { eq }) => eq(id, props.params.id),
    })
    .execute();

  // If file not found, return 404
  if (!file)
    return new Response(undefined, {
      status: 404,
    });

  // Check access control
  const isAuthorized = await checkAccessControl(file.readAccessControl);

  // If not authorized, return 401
  if (!isAuthorized)
    return new Response(undefined, {
      status: 401,
    });

  // Get file from R2
  const r2 = new R2();
  const object = await r2.getObject(file.id);

  // If file not found, return 404
  if (!object)
    return new Response(undefined, {
      status: 404,
    });

  // Return file
  return new Response(object, {
    headers:
      cache === "true" ? { "cache-control": "public, max-age=86400" } : {},
  });
};

// PUT /api/storage/[id]
export const PUT = async (req: NextRequest, props: Props) => {
  const blob = await req.blob();

  if (!blob)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Invalid file",
      })
    );

  // Get file from database
  const file = await db.query.files
    .findFirst({
      where: ({ id }, { eq }) => eq(id, props.params.id),
    })
    .execute();

  // If file not found, return 404
  if (!file)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Presign URL not found",
      }),
      {
        status: 404,
      }
    );

  // Check if already uploaded
  if (file.uploadedAt)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "File already uploaded",
      }),
      {
        status: 400,
      }
    );

  // Check expired timestamp
  if (
    dayjs()
      .add(env.R2_PRESIGNED_URL_EXPIRES_MINS, "minutes")
      .isSameOrBefore(dayjs(file.issuedAt))
  )
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Presign URL expired",
      }),
      {
        status: 401,
      }
    );

  // Check access control
  const isAuthorized = await checkAccessControl(file.writeAccessControl);

  // If not authorized, return 401
  if (!isAuthorized)
    return new Response(
      JSON.stringify({
        staus: "error",
        error: "Unauthorized",
      }),
      {
        status: 401,
      }
    );

  // Upload file to R2
  const r2 = new R2();
  const result = await r2.uploadObject(file.id, blob);

  if (!result)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Upload failed",
      }),
      {
        status: 500,
      }
    );

  // Update upload timestamp
  await db
    .update(files)
    .set({
      uploadedAt: new Date(),
    })
    .where(eq(files.id, file.id))
    .execute();

  // Return success
  return new Response(
    JSON.stringify({
      status: "success",
    }),
    {
      status: 201,
    }
  );
};

// DELETE /api/storage/[id]
export const DELETE = async (req: NextRequest, props: Props) => {
  // Get file from database
  const file = await db.query.files
    .findFirst({
      where: ({ id }, { eq }) => eq(id, props.params.id),
    })
    .execute();

  // If file not found, return 404
  if (!file)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Presign URL not found",
      }),
      {
        status: 404,
      }
    );

  // Check expired timestamp
  if (
    dayjs()
      .add(env.R2_PRESIGNED_URL_EXPIRES_MINS, "minutes")
      .isSameOrBefore(dayjs(file.issuedAt))
  )
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Presign URL expired",
      }),
      {
        status: 401,
      }
    );

  // Check access control
  const isAuthorized = await checkAccessControl(file.writeAccessControl);

  // If not authorized, return 401
  if (!isAuthorized)
    return new Response(
      JSON.stringify({
        staus: "error",
        error: "Unauthorized",
      }),
      {
        status: 401,
      }
    );

  // Delete file from R2
  const r2 = new R2();
  const result = await r2.deleteObject(file.id);

  if (!result)
    return new Response(
      JSON.stringify({
        status: "error",
        error: "Delete failed",
      }),
      {
        status: 500,
      }
    );

  // Update upload timestamp
  await db
    .update(files)
    .set({
      uploadedAt: null,
    })
    .where(eq(files.id, file.id))
    .execute();

  // Return success
  return new Response(
    JSON.stringify({
      status: "success",
    }),
    {
      status: 200,
    }
  );
};
