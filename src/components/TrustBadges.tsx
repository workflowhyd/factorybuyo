"use client";

import type { ComponentType } from "react";
import { useQuery } from "convex/react";
import {
  BadgeCheck,
  ShieldCheck,
  MessageCircle,
  Truck,
  Star,
  Clock,
  Package,
  Heart,
  Award,
  ThumbsUp,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const ICONS: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  BadgeCheck,
  ShieldCheck,
  MessageCircle,
  Truck,
  Star,
  Clock,
  Package,
  Heart,
  Award,
  ThumbsUp,
};

export default function TrustBadges() {
  const badges = useQuery(api.trustBadges.list, {});
  const visible = badges?.filter((b) => !b.hidden);

  if (visible && visible.length === 0) return null;

  return (
    <section className="border-y border-slate-100 bg-slate-50/60">
      {visible === undefined && (
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-10 sm:grid-cols-4 sm:gap-8 sm:py-14">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5 sm:flex-col sm:text-center">
              <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:h-14 sm:w-14" />
              <div className="min-w-0 flex-1 sm:w-full">
                <div className="h-3.5 w-24 animate-pulse rounded bg-slate-100 sm:mx-auto" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100 sm:mx-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {visible && visible.length > 0 && (
        <StaggerGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-10 sm:grid-cols-4 sm:gap-8 sm:py-14">
          {visible.map((badge) => {
            const Icon = ICONS[badge.icon] ?? BadgeCheck;
            const inner = (
              <>
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/10 to-brand-purple/10 text-brand transition-transform duration-300 ease-out group-hover:scale-110 sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.6} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{badge.desc}</p>
                </div>
              </>
            );
            return (
              <StaggerItem
                key={badge._id}
                className="group flex items-center gap-3.5 sm:flex-col sm:text-center"
              >
                {badge.href ? (
                  <a href={badge.href} className="contents">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}
    </section>
  );
}
