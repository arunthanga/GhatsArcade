// Pure plot-status rules (prj.md Section 8). A plot's status drives the public
// "X plots remaining" indicator: only `available` plots count as remaining.

import { PLOT_STATUSES, type PlotStatus } from "@/types";

export function isPlotStatus(value: unknown): value is PlotStatus {
  return typeof value === "string" && (PLOT_STATUSES as readonly string[]).includes(value);
}

export function isPlotAvailable(status: unknown): boolean {
  return status === "available";
}

// Count of plots still up for grabs, from a list of plot-like records.
export function countAvailablePlots(plots: readonly { status: string }[]): number {
  return plots.reduce((total, plot) => total + (isPlotAvailable(plot.status) ? 1 : 0), 0);
}
