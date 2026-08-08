"use client";

import { Fragment } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PolicyPage, { Prose } from "@/components/PolicyPage";
import RenderedBody from "@/components/RenderedBody";

type PolicySlug = "privacy-policy" | "terms-and-conditions" | "cancellation-policy";

export default function PolicyPageView({ slug }: { slug: PolicySlug }) {
  const data = useQuery(api.policy.getPage, { slug });

  if (data === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <div className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const { page, sections } = data;

  return (
    <PolicyPage
      title={page?.title ?? ""}
      intro={page?.intro}
      lastUpdated={page?.lastUpdated}
    >
      <Prose>
        {sections.map((section) => (
          <Fragment key={section._id}>
            <h2>{section.heading}</h2>
            <RenderedBody text={section.body} />
          </Fragment>
        ))}
      </Prose>
    </PolicyPage>
  );
}
