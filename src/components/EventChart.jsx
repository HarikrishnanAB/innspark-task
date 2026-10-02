import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEMO_END = new Date(
  "2026-10-01T23:59:00+05:30"
);

const IST_TIMEZONE = "Asia/Kolkata";

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

function EventChart({ events, range }) {
  let start;
  let bucketSize;
  let bucketCount;

  if (range === "24H") {
    start = new Date(
      DEMO_END.getTime() -
        24 * 60 * 60 * 1000
    );

    bucketSize = 60 * 60 * 1000;
    bucketCount = 24;
  }

  if (range === "7D") {
    start = new Date(
      DEMO_END.getTime() -
        7 * 24 * 60 * 60 * 1000
    );

    bucketSize = 24 * 60 * 60 * 1000;
    bucketCount = 7;
  }

  if (range === "30D") {
    start = new Date(
      DEMO_END.getTime() -
        30 * 24 * 60 * 60 * 1000
    );

    bucketSize = 24 * 60 * 60 * 1000;
    bucketCount = 30;
  }

  /*
   * Create buckets covering the complete
   * selected period.
   */
  const buckets = Array.from(
    { length: bucketCount },
    (_, index) => {
      const bucketStart =
        start.getTime() +
        index * bucketSize;

      const bucketEnd =
        bucketStart + bucketSize;

      return {
        timestamp: bucketStart,
        bucketEnd,
        events: [],
      };
    }
  );

  /*
   * Put every event into the bucket that
   * actually contains its timestamp.
   */
  events.forEach((event) => {
    const eventTime = new Date(
      event.timestamp
    ).getTime();

    if (
      eventTime < start.getTime() ||
      eventTime > DEMO_END.getTime()
    ) {
      return;
    }

    const bucketIndex = Math.floor(
      (eventTime - start.getTime()) /
        bucketSize
    );

    if (
      bucketIndex >= 0 &&
      bucketIndex < buckets.length
    ) {
      buckets[bucketIndex].events.push(
        event
      );
    }
  });

  const data = buckets.map((bucket) => {
    const date = new Date(
      bucket.timestamp
    );

    return {
      timestamp: bucket.timestamp,

      label:
        range === "24H"
          ? date.toLocaleTimeString(
              "en-IN",
              {
                timeZone: IST_TIMEZONE,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )
          : date.toLocaleDateString(
              "en-IN",
              {
                timeZone: IST_TIMEZONE,
                day: "2-digit",
                month: "short",
              }
            ),

      events: bucket.events.length,

      details: bucket.events,
    };
  });

  const total = data.reduce(
    (sum, item) =>
      sum + item.events,
    0
  );

  const peak = Math.max(
    ...data.map(
      (item) => item.events
    ),
    0
  );

  function TooltipContent({
    active,
    payload,
  }) {
    if (
      !active ||
      !payload ||
      !payload.length
    ) {
      return null;
    }

    const item =
      payload[0].payload;

    return (
      <div className="chart-tooltip">
        <div className="tooltip-heading">
          <span>
            EVENT ACTIVITY
          </span>

          <strong>
            {formatDate(
              item.timestamp
            )}
          </strong>
        </div>

        <div className="tooltip-count">
          <strong>
            {item.events}
          </strong>

          <span>
            {item.events === 1
              ? "event"
              : "events"}
          </span>
        </div>

        <div className="tooltip-list">
          {item.details.map(
            (event) => (
              <div
                className="tooltip-event"
                key={event.id}
              >
                <div>
                  <strong>
                    {event.id}
                  </strong>

                  <span>
                    {formatTime(
                      event.timestamp
                    )}
                  </span>
                </div>

                <small>
                  {event.severity} ·{" "}
                  {event.eventType}
                </small>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <div className="chart-meta">
        <div>
          <span>
            SELECTED PERIOD
          </span>

          <strong>
            {range === "24H"
              ? "Last 24 hours"
              : range === "7D"
              ? "Last 7 days"
              : "Last 30 days"}
          </strong>
        </div>

        <div>
          <span>EVENTS</span>

          <strong>
            {total}
          </strong>
        </div>

        <div>
          <span>PEAK</span>

          <strong>
            {peak}
          </strong>
        </div>
      </div>

      <div className="chart">
        <ResponsiveContainer
          width="100%"
          height={315}
        >
          <AreaChart
            data={data}
            margin={{
              top: 12,
              right: 12,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="eventArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopOpacity={0.28}
                />

                <stop
                  offset="100%"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 4"
              opacity={0.08}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
              }}
              minTickGap={
                range === "24H"
                  ? 22
                  : 16
              }
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{
                fontSize: 11,
              }}
            />

            <Tooltip
              content={
                <TooltipContent />
              }
            />

            <Area
              type="monotone"
              dataKey="events"
              strokeWidth={2.5}
              fill="url(#eventArea)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <span>
          <i />
          Data synchronized with
          Event Management
        </span>

        <span>
          Hover over a point to
          inspect events
        </span>
      </div>
    </div>
  );
}

export default EventChart;