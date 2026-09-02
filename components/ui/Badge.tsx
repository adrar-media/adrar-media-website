import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  tone?: "atlas" | "light" | "deep";
}

/** Accent court et affirmé : numéro de service, mise en avant d'un résultat. */
export function Badge({ children, className, tone = "atlas" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-caption",
        tone === "atlas" && "bg-atlas text-canvas",
        tone === "light" && "bg-light text-surface",
        tone === "deep" && "bg-surface text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
