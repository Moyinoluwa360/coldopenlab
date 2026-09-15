"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import styles from "./ImageUpload.module.css";

type UploadType = "team" | "blog" | "case-study";

/**
 * Image picker + fixed-aspect cropper. Enforces the required crop ratio per
 * content type (3:4 team, 16:9 blog, 3:2 case study), uploads the cropped blob
 * to Storage via /api/admin/upload, and returns the stored URL through onChange.
 */
export function ImageUpload({
  value,
  onChange,
  aspect,
  type,
  ratioLabel,
}: {
  value: string;
  onChange: (url: string) => void;
  aspect: number;
  type: UploadType;
  ratioLabel: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => setAreaPixels(pixels), []);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }

  async function upload() {
    if (!src || !areaPixels) return;
    setBusy(true);
    setError("");
    try {
      const blob = await getCroppedBlob(src, areaPixels);
      const form = new FormData();
      form.append("file", blob, "upload.jpg");
      form.append("type", type);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
      setSrc(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      {value && !src && (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Current selection" style={{ aspectRatio: aspect }} />
          <button type="button" className={styles.remove} onClick={() => onChange("")}>
            Remove image
          </button>
        </div>
      )}

      {src && (
        <>
          <div className={styles.cropArea}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className={styles.controls}>
            <label className={styles.zoom}>
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
            <button type="button" className="button" onClick={upload} disabled={busy}>
              {busy ? "Uploading…" : "Crop & upload"}
            </button>
            <button
              type="button"
              className={styles.remove}
              onClick={() => {
                setSrc(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {!src && (
        <label className={styles.picker}>
          {value ? "Replace image" : "Choose image"} ({ratioLabel})
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} hidden />
        </label>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Render the selected crop region to a JPEG blob via canvas. */
async function getCroppedBlob(src: string, area: Area): Promise<Blob> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");
  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process the image."))),
      "image/jpeg",
      0.9
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = src;
  });
}
