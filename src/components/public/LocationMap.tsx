"use client";

import dynamic from "next/dynamic";

// Load the actual Leaflet map only in the browser. Keeping the dynamic() call in this
// client component avoids the "ssr: false is not allowed in Server Components" error.
// Reused anywhere we want a single-marker OpenStreetMap (project detail, contact, ...).
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-lg border border-brand-100 bg-brand-50" />
  ),
});

export function LocationMap(props: {
  latitude: number;
  longitude: number;
  title: string;
}) {
  return (
    <div className="space-y-2">
      <LeafletMap {...props} />
      <a
        href={`https://www.openstreetmap.org/?mlat=${props.latitude}&mlon=${props.longitude}#map=14/${props.latitude}/${props.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-medium text-brand-600 hover:text-brand-900"
      >
        View larger map →
      </a>
    </div>
  );
}
