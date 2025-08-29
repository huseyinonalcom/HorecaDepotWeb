import Card from "../universal/Card";
import {
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from "recharts";

export default function SingleLineChart({
  data,
  title,
  lineDataKey,
  legendDataKey,
}: {
  data: any;
  title: string;
  lineDataKey: string;
  legendDataKey: string;
}) {
  return (
    <Card>
      <div className="flex h-[420px] w-full flex-col">
        <div className="mb-2 font-bold">{title}</div>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={legendDataKey} />
            <YAxis />
            <Line dataKey={lineDataKey} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
