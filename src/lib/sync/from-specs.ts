export type SyncTicket = {
  key: string;
  title: string;
  parent?: string;
  folder: string;
  specFile: string;
};

export function syncSpecsToTracker(input: {
  parent?: string;
  folder?: string;
  specs: { file: string; titles: string[] }[];
  existingKeys?: string[];
}): { created: SyncTicket[]; skipped: string[] } {
  const created: SyncTicket[] = [];
  const skipped: string[] = [];
  const existing = new Set(input.existingKeys ?? []);
  let n = 1;

  for (const spec of input.specs) {
    for (const title of spec.titles) {
      const key = `TC-${String(n).padStart(3, "0")}`;
      n += 1;
      if (existing.has(title)) {
        skipped.push(title);
        continue;
      }
      created.push({
        key,
        title: title.startsWith("Verify that") ? title : `Verify that ${title}`,
        parent: input.parent,
        folder: input.folder ?? "Mesa / Web / Inbox",
        specFile: spec.file,
      });
    }
  }

  return { created, skipped };
}
