import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "invert";
}

/** Étiquette de catégorie (secteur, service, filtre de portfolio). */
export function Tag({ children, className, tone = "neutral" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-small",
        tone === "neutral" && "border-canvas-gray text-anthracite/70",
        tone === "invert" && "border-white/25 text-white/75",
        className,
      )}
    >
      {children}
    </span>
  );
}
