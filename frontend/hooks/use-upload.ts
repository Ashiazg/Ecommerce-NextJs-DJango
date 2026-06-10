"use client";

import { useState } from "react";

type UploadState = {
  uploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
};

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
  });

  const upload = async (file: File, endpoint: string) => {
    setState({ uploading: true, progress: 0, error: null, url: null });

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setState({ uploading: false, progress: 100, error: null, url: data.image });
      return data;
    } catch (err) {
      setState({ uploading: false, progress: 0, error: (err as Error).message, url: null });
      return null;
    }
  };

  return { ...state, upload };
}
