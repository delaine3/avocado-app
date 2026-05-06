"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Photo = {
  id: number;
  photo_url: string;
};

type Props = {
  photos: Photo[];
  altBase: string;
};

export default function PhotoCarousel({ photos, altBase }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  function goPrevious() {
    setCurrentIndex((index) => (index === 0 ? photos.length - 1 : index - 1));
  }

  function goNext() {
    setCurrentIndex((index) => (index === photos.length - 1 ? 0 : index + 1));
  }

  return (
    <div className="mt-3">
      <div className="relative flex max-h-96 w-full items-center justify-center overflow-hidden rounded bg-black/5">
        <img
          src={currentPhoto.photo_url}
          alt={`${altBase} ${currentIndex + 1}`}
          className="max-h-96 w-auto object-contain"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#4a2c14] shadow hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#4a2c14] shadow hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#4a2c14]">
          <span>
            {currentIndex + 1} / {photos.length}
          </span>

          <div className="flex gap-1">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-[#4a2c14]" : "bg-[#4a2c14]/30"
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
