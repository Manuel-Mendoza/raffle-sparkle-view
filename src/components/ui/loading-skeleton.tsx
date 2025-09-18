import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "hero" | "card" | "text" | "button";
}

export function LoadingSkeleton({
  className,
  variant = "card",
}: LoadingSkeletonProps) {
  const baseClasses =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  const variants = {
    hero: "min-h-[600px] rounded-xl",
    card: "h-48 rounded-lg",
    text: "h-4 rounded",
    button: "h-10 rounded-md w-32",
  };

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      style={{
        animation: "shimmer 2s infinite linear",
      }}
    />
  );
}

// Agregar CSS para la animación shimmer
const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Inyectar CSS si no existe
if (
  typeof document !== "undefined" &&
  !document.getElementById("shimmer-styles")
) {
  const style = document.createElement("style");
  style.id = "shimmer-styles";
  style.textContent = shimmerCSS;
  document.head.appendChild(style);
}
