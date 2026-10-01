import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function EventChart({ events, range }) {
  const now = Date.now();

  const rangeHours = {
    "24h": 24,
    "7d": 24 * 7,
    "30d": 24 * 30,
  };

  const hours = rangeHours[range];

  const buckets = Array.from({ length: 12 }, (_, index) => ({
    label:
      range === "24h"
        ? `${23 - index * 2}h`
        : `${Math.max(1, Math.round(
            ((11 - index) / 11) * hours
          ))}h`,
    count: 0,
    timestamp:
      now -
      (11 - index) * ((hours * 60 * 60 * 1000) / 12),
  })).reverse();

  events.forEach((event) => {
    const eventTime = new Date(event.timestamp).getTime();
    const difference = now - eventTime;

    if (difference < 0 || difference > hours * 60 * 60 * 1000) {
      return;
    }

    const bucketSize =
      (hours * 60 * 60 * 1000) / buckets.length;

    const index = Math.min(
      buckets.length - 1,
      Math.floor(
        (hours * 60 * 60 * 1000 - difference) / bucketSize
      )
    );

    if (buckets[index]) {
      buckets[index].count++;
    }
  });

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={buckets}>
          <defs>
            <linearGradient
              id="eventGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#38bdf8"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="#38bdf8"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#263246"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7f8da3", fontSize: 12 }}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7f8da3", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #263246",
              borderRadius: "10px",
              color: "#fff",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#eventGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventChart;