"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

type CompressedImageInputProps = {
  name: string;
  id: string;
};

export default function CompressedImageInput({
  name,
  id,
}: CompressedImageInputProps) {
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setCompressedFile(null);
      setStatus("");
      return;
    }

    setStatus("Compressing image...");

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const newFile = new File([compressed], file.name, {
        type: compressed.type,
      });

      setCompressedFile(newFile);

      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (newFile.size / 1024 / 1024).toFixed(2);

      setStatus(`Compressed from ${originalSize}MB to ${compressedSize}MB`);
    } catch {
      setStatus("Could not compress image. Try a smaller photo.");
      setCompressedFile(null);
    }
  }

  return (
    <div>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full rounded border px-4 py-3 outline-none"
      />

      {compressedFile && (
        <input
          type="file"
          name={name}
          className="hidden"
          ref={(input) => {
            if (!input) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(compressedFile);
            input.files = dataTransfer.files;
          }}
        />
      )}

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
