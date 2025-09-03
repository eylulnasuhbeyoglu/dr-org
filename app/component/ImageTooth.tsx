"use client";
import React from "react";

export type ToothType = "incisor" | "canine" | "premolar" | "molar";

const TOOTH_IMAGES: Record<ToothType, string> = {
  incisor: "/teeth/incisor.png",
  canine: "/teeth/canine.png",
  premolar: "/teeth/premolar.png",
  molar: "/teeth/molar.png",
};

const ImageTooth: React.FC<{ type: ToothType; width?: number; height?: number }> = ({
  type,
  width = 60,
  height = 60,
}) => {
  const src = TOOTH_IMAGES[type];
  return <image href={src} width={width} height={height} />;
};

export default ImageTooth;
