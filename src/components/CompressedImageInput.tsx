"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

type Props = {
  name: string;
  id: string;
  multiple?: boolean;
};

export default function CompressedImageInput({
  name,
  id,
  multiple = false,
}: Props) {
  const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      setCompressedFiles([]);
      setStatus("");
      return;
    }

    setStatus("Compressing images...");

    try {
      const compressed = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          });

          return new File([compressedFile], file.name, {
            type: compressedFile.type,
          });
        }),
      );

      setCompressedFiles(compressed);

      const originalTotal = files.reduce((sum, file) => sum + file.size, 0);
      const compressedTotal = compressed.reduce(
        (sum, file) => sum + file.size,
        0,
      );

      setStatus(
        `Compressed ${files.length} image${files.length === 1 ? "" : "s"} from ${(
          originalTotal /
          1024 /
          1024
        ).toFixed(2)}MB to ${(compressedTotal / 1024 / 1024).toFixed(2)}MB`,
      );
    } catch {
      setStatus("Could not compress images. Try smaller photos.");
      setCompressedFiles([]);
    }
  }

  return (
    <div>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="w-full rounded border px-4 py-3 outline-none"
      />

      {compressedFiles.length > 0 && (
        <input
          type="file"
          name={name}
          multiple={multiple}
          className="hidden"
          ref={(input) => {
            if (!input) return;

            const dataTransfer = new DataTransfer();

            compressedFiles.forEach((file) => {
              dataTransfer.items.add(file);
            });

            input.files = dataTransfer.files;
          }}
        />
      )}

      {status && <p className="mt-2 text-sm text-stone-600">{status}</p>}
    </div>
  );
}
