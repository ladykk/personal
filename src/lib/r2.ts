import { TGeneratePresignedUrlInput } from "@/server/services/r2";

export const fileToPresignedUrlInput = (
  file: File
): TGeneratePresignedUrlInput => ({
  fileName: file.name,
  fileType: file.type,
  fileSize: file.size,
});

export const uploadFile = async (file: File, key: string) => {
  return await fetch(`/api/storage/${key}`, {
    method: "PUT",
    body: file,
  }).then(async (res) => {
    const json = await res.json();
    if (res.status === 201) return json as { status: "success" };
    else return json as { status: "error"; error: string };
  });
};

export const deleteFile = async (key: string) => {
  return await fetch(`/api/storage/${key}`, {
    method: "DELETE",
  }).then(async (res) => {
    const json = await res.json();
    if (res.status === 200) return json as { status: "success" };
    else return json as { status: "error"; error: string };
  });
};
