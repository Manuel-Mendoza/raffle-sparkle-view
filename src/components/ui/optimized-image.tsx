import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+",
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && !error && (
        <img
          src={placeholder}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover blur-sm",
            className
          )}
        />
      )}

      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />

      {error && (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-200 text-gray-500",
            className
          )}
        >
          Error al cargar imagen
        </div>
      )}
    </div>
  );
}
