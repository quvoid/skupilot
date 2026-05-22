/**
 * POST /api/export-csv
 * Converts enriched product data to a downloadable CSV file.
 * Returns the file directly as a streamed response.
 */

import { NextResponse } from "next/server";
import type { EnrichedData } from "@/store/useEnrichmentStore";

function escapeCSV(value: string | number | undefined): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  // Wrap in quotes if contains comma, newline, or quotes
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function POST(req: Request) {
  try {
    const { data, filename }: { data: EnrichedData; filename?: string } =
      await req.json();

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // ── Build CSV rows ────────────────────────────────────────────────────────
    const rows: string[] = [];

    // Header row
    rows.push(
      [
        "SEO Title",
        "Description",
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
        "Quality Score",
        ...Object.keys(data.attributes ?? {}).map((k) => `Attr: ${k}`),
      ]
        .map(escapeCSV)
        .join(",")
    );

    // Data row
    const features = data.features ?? [];
    rows.push(
      [
        data.seoTitle,
        data.description?.replace(/\n/g, " "),
        features[0] ?? "",
        features[1] ?? "",
        features[2] ?? "",
        features[3] ?? "",
        features[4] ?? "",
        data.qualityScore,
        ...Object.values(data.attributes ?? {}),
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csvContent = rows.join("\n");
    const outputFilename = filename ?? `skupilot-export-${Date.now()}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error("[/api/export-csv] Error:", error);
    return NextResponse.json(
      { error: "CSV export failed" },
      { status: 500 }
    );
  }
}
