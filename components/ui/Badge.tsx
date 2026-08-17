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
        "inline-flex items-center rounded px-2 py-1 text-caption uppercase",
        tone === "atlas" && "bg-atlas text-white",
        tone === "light" && "bg-light text-deep",
        tone === "deep" && "bg-deep text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
