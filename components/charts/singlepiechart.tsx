import {
  ResponsiveContainer,
  Tooltip,
  Pie,
  PieChart,
  Legend,
  Cell,
} from "recharts";
import Card from "../universal/Card";
import { palette } from "./universal";

export default function SinglePieChart({
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
          <PieChart>
            <Pie
              data={data}
              dataKey={lineDataKey}
              nameKey={legendDataKey}
            >
              {data.map((e, i) => (
                <Cell fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
