import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparkLineProps {
  data: number[];
  color?: string;
  height?: number;
}

const SparkLine = ({ data, color = "#00d4ff", height = 32 }: SparkLineProps) => {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLine;
