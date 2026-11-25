"use client";

import { IconStar } from "./icons";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
};

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`${value} de 5`}>
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        if (onChange) {
          return (
            <button
              key={star}
              type="button"
              aria-label={`${star} estrellas`}
              onClick={() => onChange(star)}
              className={filled ? "text-accent" : "text-slate-300 hover:text-accent"}
            >
              <IconStar className={dim} filled={filled} />
            </button>
          );
        }
        return (
          <IconStar
            key={star}
            className={`${dim} ${filled ? "text-accent" : "text-slate-300"}`}
            filled={filled}
          />
        );
      })}
    </div>
  );
}
