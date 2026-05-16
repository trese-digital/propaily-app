"use client";

import { useTransition } from "react";

import { IcGrid, IcList } from "@/components/icons";
import { Segmented } from "@/components/ui";

import { setPropertyView } from "./view-actions";
import type { PropertyView } from "./view-config";

export function ViewToggle({ view }: { view: PropertyView }) {
  const [pending, startTransition] = useTransition();

  return (
    <Segmented
      className={pending ? "opacity-60 transition-opacity" : "transition-opacity"}
      value={view}
      onValueChange={(v) => {
        if (v === view) return;
        startTransition(async () => {
          await setPropertyView(v as PropertyView);
        });
      }}
      items={[
        {
          id: "grid",
          label: (
            <>
              <IcGrid size={14} />
              Grid
            </>
          ),
        },
        {
          id: "list",
          label: (
            <>
              <IcList size={14} />
              Lista
            </>
          ),
        },
      ]}
    />
  );
}
