
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import React from "react";
import { imageUrl } from "../common/image";

type Raw = {
  result: {
    id: number;
    times_viewed: string;
    product: { localized_name: string };
    images: { url: string; id: number }[];
  }[];
};

type Row = {
  name: string;
  views: number;
  imageUrl: string | null;
};

function toRows(raw: Raw["result"]): Row[] {
  return raw
    .map((r) => ({
      name: r.product?.localized_name ?? `#${r.id}`,
      views: Number(r.times_viewed ?? 0),
      imageUrl: r.images?.[0]?.url ?? null,
    }))
    .sort((a, b) => b.views - a.views);
}

// Custom Y-axis tick: thumbnail + text placed to the LEFT of the axis line
function makeYAxisTick(thumbnailByName: Record<string, string | null>) {
  return function CustomYAxisTick({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }) {
    const url = thumbnailByName[payload.value] ?? null;
    const SIZE = 18; // thumbnail size
    const GAP = 6; // spacing between elements

    // Position image just left of the axis x; text further left of the image
    const imgX = x - SIZE - GAP;
    const imgY = y - SIZE / 2 + 1;
    const textX = imgX - GAP;

    return (
      <g>
        {url ? (
          <image href={url} x={imgX} y={imgY} width={SIZE} height={SIZE} />
        ) : null}
        <text x={textX} y={y} dy={4} textAnchor="end" fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  };
}

// Tooltip with larger thumbnail
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  const datum: Row | undefined = payload[0]?.payload;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,.1)",
        padding: 8,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,.08)",
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {datum?.imageUrl ? (
          <img
            src={imageUrl(datum.imageUrl)}
            alt={label}
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : null}
        <div>
          <div style={{ fontWeight: 600 }}>{label}</div>
          <div>{datum?.views} views</div>
        </div>
      </div>
    </div>
  );
};

export default function TopViewedTodayChart({
  data,
  title = "Most Viewed Today",
}: {
  data: Raw;
  title?: string;
}) {
  const rows = toRows(data.result);

  // Map product name -> resolved thumbnail URL for the custom ticks
  const thumbMap: Record<string, string | null> = Object.fromEntries(
    rows.map((r) => [r.name, r.imageUrl ? imageUrl(r.imageUrl) : null]),
  );

  // Palette for per-bar colors (tweak as you like)
  const palette = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#d88584",
  ];

  return (
    <div className="flex h-[420px] w-full flex-col">
      <div className="mb-2 font-bold">{title}</div>
      <ResponsiveContainer>
        <BarChart data={rows} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={makeYAxisTick(thumbMap)}
            width={120}
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="views" radius={[4, 4, 4, 4]}>
            {rows.map((_, i) => (
              <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
