import useTranslation from "next-translate/useTranslation";
import { imageUrl } from "../common/image";
import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Bar,
} from "recharts";
import Card from "../universal/Card";

type Raw = {
  result: {
    id: number;
    times_viewed: string;
    product: {
      localized_name: {
        en: string;
        fr: string;
        de: string;
        nl: string;
      };
    };
    images: { url: string; id: number }[];
  }[];
};

type Row = {
  id: number;
  views: number;
};

function toRows(raw: Raw["result"]): Row[] {
  return raw
    .map((r) => ({
      id: r.id,
      views: Number(r.times_viewed ?? 0),
    }))
    .sort((a, b) => b.views - a.views);
}

function makeYAxisTick(
  nameMap: Record<number, string>,
  imageMap: Record<number, string | null>,
) {
  return function CustomYAxisTick({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: number };
  }) {
    const name = nameMap[payload.value];
    const url = imageMap[payload.value];
    const SIZE = 18;
    const GAP = 6;

    const imgX = x - SIZE - GAP;
    const imgY = y - SIZE / 2 + 1;
    const textX = imgX - GAP;

    return (
      <g>
        {url ? (
          <image
            href={imageUrl(url)}
            x={imgX}
            y={imgY}
            width={SIZE}
            height={SIZE}
          />
        ) : null}
        <text x={textX} y={y} dy={4} textAnchor="end" fontSize={12}>
          {name}
        </text>
      </g>
    );
  };
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload || !payload.length) return null;
  const datum: Row | undefined = payload[0]?.payload;
  if (!datum) return null;

  const name = nameMap[datum.id];
  const url = imageMap[datum.id];

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
        {url ? (
          <img
            src={imageUrl(url)}
            alt={name}
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : null}
        <div>
          <div style={{ fontWeight: 600 }}>{name}</div>
          <div>{datum.views} views</div>
        </div>
      </div>
    </div>
  );
};

let nameMap: Record<number, string> = {};
let imageMap: Record<number, string | null> = {};

export default function TopViewedChart({
  data,
  title,
}: {
  data: Raw;
  title?: string;
}) {
  const { t, lang } = useTranslation("common");
  const rows = toRows(data.result);

  nameMap = {};
  imageMap = {};
  data.result.forEach((item) => {
    nameMap[item.id] = item.product?.localized_name[lang] ?? `#${item.id}`;
    imageMap[item.id] = item.images?.[0]?.url ?? null;
  });

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
    <Card>
      <div className="flex h-[420px] w-full flex-col">
        <div className="mb-2 font-bold">{title ?? t("most-viewed-today")}</div>
        <ResponsiveContainer>
          <BarChart data={rows} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="id"
              tick={makeYAxisTick(nameMap, imageMap)}
              width={140}
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
    </Card>
  );
}
