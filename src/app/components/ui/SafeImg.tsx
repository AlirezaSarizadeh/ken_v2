import React from "react";

type SafeImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

// Renders <img> when src is truthy; placeholder div otherwise.
// Prevents "empty string passed to src" console errors from null API images.
export default function SafeImg({ src, alt = "", className, style, ...props }: SafeImgProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-red-950/30 to-black/50 ${className ?? ""}`}
        style={style}
        role="img"
        aria-label={alt || undefined}
      >
        <span
          className="text-red-900/30 text-5xl select-none"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          侍
        </span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} {...props} />;
}
