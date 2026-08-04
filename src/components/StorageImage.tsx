"use client";

import Image, { type ImageProps } from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface StorageImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

export default function StorageImage({ src, alt, ...props }: StorageImageProps) {
  const isStorageId = src.startsWith("storage:");
  const storageId = isStorageId
    ? (src.slice("storage:".length) as Id<"_storage">)
    : undefined;
  const storageUrl = useQuery(
    api.files.getPublicUrl,
    storageId ? { storageId } : "skip"
  );

  const finalSrc = isStorageId ? storageUrl : src;

  if (isStorageId && storageUrl === undefined) {
    return <div className="relative h-full w-full bg-slate-100" />;
  }

  if (isStorageId && storageUrl === null) {
    return null;
  }

  return <Image src={finalSrc ?? src} alt={alt} {...props} />;
}
