"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { duration, easing, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Ratio CSS appliqué au cadre (ex. "4/5", "16/9"). */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Image dévoilée par un volet qui se rétracte, avec un léger zoom sortant.
 * Le cadre impose son ratio dès le rendu serveur : aucun décalage de mise en
 * page pendant le chargement.
 */
export function ImageReveal({
  src,
  alt,
  width,
  height,
  className,
  ratio = "4/5",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImageRevealProps) {
  return (
    <div
      className={cn("relative overflow-hidden bg-canvas-gray", className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
        transition={{ duration: 1.1, ease: easing }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.span
        aria-hidden
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={viewport}
        transition={{ duration: duration.slow, ease: easing }}
        style={{ transformOrigin: "top" }}
        className="absolute inset-0 bg-deep"
      />
    </div>
  );
}
