"use client";

import { useState, useRef } from "react";

type FileUploadProps = {
  endpoint: string;
  accept?: string;
  onUploaded: (url: string) => void;
};

export default function FileUpload({ endpoint, accept = "image/*", onUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir archivo");
      const data = await res.json();
      onUploaded(data.image);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded" />
        ) : (
          <p className="text-text-muted text-sm">Arrastra o haz click para subir imagen</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {uploading && <p className="text-text-muted text-sm">Subiendo...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
