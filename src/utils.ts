import type { ReducedTrialRow } from "psyflow-web";

export function summarizeBlock(rows: ReducedTrialRow[], blockId: string): { accuracy: number } {
  const blockRows = rows.filter(
    (row) => row.block_id === blockId && typeof row.stimulus_hit === "boolean"
  );
  if (blockRows.length === 0) {
    return { accuracy: 0 };
  }
  const hits = blockRows.filter((row) => row.stimulus_hit === true);
  return {
    accuracy: hits.length / blockRows.length
  };
}
