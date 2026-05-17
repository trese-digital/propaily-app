"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => void;
}

const PULL_THRESHOLD = 80; // px needed to trigger refresh
const MAX_PULL = 120; // maximum pull distance

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
        if (onRefresh) {
          await onRefresh();
        } else {
          router.refresh();
        }
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Only start tracking if we're at the top of the scroll
      if (container.scrollTop === 0) {
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === 0) return;

      const touchY = e.touches[0].clientY;
      const diff = touchY - touchStartY;

      // Only pull down if we're at the top and moving down
      if (diff > 0 && container.scrollTop === 0) {
        e.preventDefault(); // Prevent default scroll
        setIsPulling(true);
        const newDistance = Math.min(diff * 0.5, MAX_PULL); // Add resistance
        setPullDistance(newDistance);
      }
    };

    const handleTouchEnd = () => {
      if (isPulling && pullDistance >= PULL_THRESHOLD) {
        handleRefresh();
      } else {
        // Reset without refreshing
        setPullDistance(0);
        setIsPulling(false);
      }
      setTouchStartY(0);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStartY, isPulling, pullDistance, onRefresh, router]);

  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const opacity = pullProgress * 0.8 + 0.2;
  const scale = pullProgress * 0.3 + 0.7;

  return (
    <div
      ref={containerRef}
      style={{
        height: "100dvh",
        overflowY: "auto",
        position: "relative",
        transform: isPulling ? `translateY(${pullDistance}px)` : undefined,
        transition: isPulling || isRefreshing ? "none" : "transform 0.2s ease-out",
      }}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div
          style={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            opacity,
          }}
        >
          <div
            className="pp-spin"
            style={{
              width: 20,
              height: 20,
              border: "2px solid var(--ink-200)",
              borderTopColor: "var(--pp-500)",
              borderRadius: "50%",
              transform: `scale(${scale})`,
              animation: (isRefreshing || pullDistance >= PULL_THRESHOLD)
                ? "pp-spin 0.8s linear infinite"
                : "none",
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}