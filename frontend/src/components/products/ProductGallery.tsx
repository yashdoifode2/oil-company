"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/api";

type Img = { id: number; image: string; alt_text: string };

export function ProductGallery({
  main,
  mainAlt,
  images,
}: {
  main: string | null;
  mainAlt: string;
  images: Img[];
}) {
  const all: Img[] = [
    ...(main ? [{ id: 0, image: main, alt_text: mainAlt || "Product image" }] : []),
    ...images,
  ];
  const [active, setActive] = useState(0);

  if (!all.length) {
    return <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No image</div>;
  }

  return (
    <div>
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(all[active].image)}
          alt={all[active].alt_text || "Product image"}
          className="w-full h-full object-contain"
        />
      </div>
      {all.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {all.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`aspect-square bg-gray-50 rounded border-2 overflow-hidden ${
                i === active ? "border-current" : "border-transparent"
              }`}
              style={i === active ? { borderColor: "var(--color-primary)" } : undefined}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(img.image)}
                alt={img.alt_text || `Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}