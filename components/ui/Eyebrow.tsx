import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  /** Trait court à gauche — marqueur éditorial récurrent du site. */
  rule?: boolean;
}

export function Eyebrow({ children, className, rule = true }: EyebrowProps) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-3", className)}>
      {rule && <span aria-hidden className="h-px w-8 bg-current opacity-50" />}
      {children}
    </span>
  );
}
