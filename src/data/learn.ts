/* ────────────────────────────────────────────────────────────────
   src/data/learn.ts
   Helpers for the “learn” content collection
   ──────────────────────────────────────────────────────────────── */

import { type CollectionEntry, getCollection } from "astro:content";

/* ------------------------------------------------------------------
   1. Fetch every entry in the learn collection
   ------------------------------------------------------------------ */
export async function getAllLearn(): Promise<CollectionEntry<"learn">[]> {
  return await getCollection("learn", ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
}

/* ------------------------------------------------------------------
   2. Group entries by the `topic` field
   ------------------------------------------------------------------ */
export function groupLearnByTopic(
  entries: CollectionEntry<"learn">[],
): Record<string, CollectionEntry<"learn">[]> {
  return entries.reduce((acc, entry) => {
    const topic = entry.data.topic ?? "Other";
    (acc[topic] ??= []).push(entry);
    return acc;
  }, {} as Record<string, CollectionEntry<"learn">[]>);
}

/* ------------------------------------------------------------------
   3. Tag utilities (same logic as before)
   ------------------------------------------------------------------ */
export function getAllTags(entries: CollectionEntry<"learn">[]) {
  return entries.flatMap((e) => [...e.data.tags]);
}

export function getUniqueTags(entries: CollectionEntry<"learn">[]) {
  return [...new Set(getAllTags(entries))];
}

export function getUniqueTagsWithCount(
  entries: CollectionEntry<"learn">[],
): [string, number][] {
  return [
    ...getAllTags(entries).reduce(
      (acc, tag) => acc.set(tag, (acc.get(tag) ?? 0) + 1),
      new Map<string, number>(),
    ),
  ].sort((a, b) => b[1] - a[1]);
}
