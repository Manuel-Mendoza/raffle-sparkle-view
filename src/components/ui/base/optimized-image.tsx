import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive image URLs for external images
  const generateResponsiveSrc = (originalSrc: string) => {
    if (originalSrc.includes("ibb.co")) {
      // For external images, create different sizes using URL parameters
      const baseUrl = originalSrc.split("?")[0];
      return {
        small: `${baseUrl}?w=400&q=75`,
        medium: `${baseUrl}?w=800&q=80`,
        large: `${baseUrl}?w=1200&q=85`,
        original: originalSrc,
      };
    }
    return { original: originalSrc };
  };

  const responsiveSrc = generateResponsiveSrc(src);

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

      <picture>
        {responsiveSrc.small && (
          <>
            <source media="(max-width: 480px)" srcSet={responsiveSrc.small} />
            <source
              media="(max-width: 768px)"
              srcSet={responsiveSrc.medium || responsiveSrc.small}
            />
            <source
              media="(min-width: 769px)"
              srcSet={
                responsiveSrc.large ||
                responsiveSrc.medium ||
                responsiveSrc.small
              }
            />
          </>
        )}
        <img
          src={responsiveSrc.original}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </picture>

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
