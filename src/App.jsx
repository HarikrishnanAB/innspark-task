import { useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";

import EventChart from "./components/EventChart";
import KpiEventsPage from "./components/KpiEventsPage";
import baseEvents from "./data/events.json";

const PAGE_SIZE = 10;

const DEMO_END = new Date(
  "2026-10-01T23:59:00+05:30"
);

const SEVERITIES = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];

const STATUSES = [
  "All",
  "Open",
  "Investigating",
  "Resolved",
];

const PROTOCOLS = [
  "All",
  "TCP",
  "UDP",
  "HTTP",
  "HTTPS",
  "ICMP",
];

const eventOffsets = [
  // Last 24 hours
  1,
  3,
  5,
  7,
  9,
  12,
  15,
  18,
  21,
  23,

  // 2-7 days
  27,
  31,
  36,
  42,
  48,
  55,
  61,
  68,
  75,
  83,
  91,
  99,
  108,
  118,
  129,
  141,
  153,
  165,

  // 8-30 days
  178,
  191,
  204,
  218,
  232,
  246,
  260,
  274,
  288,
  302,
  316,
  330,
  344,
  358,
  372,
  386,
  400,
  414,
  428,
  442,
  456,
  470,
  484,
  498,
  512,
  526,
  540,
  554,
  568,
  582,
  596,
  610,
  624,
  638,
  652,
  666,
  680,
  694,
  708,
];

function createISTTimestamp(date) {
  const formatter = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );

  const parts = formatter.formatToParts(date);

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}+05:30`;
}

function generateEvents() {
  const events = [];

  // Generate 150 events across the last 30 days
  // in strictly chronological order.
  for (let i = 0; i < 150; i++) {
    const eventDate = new Date(
      DEMO_END.getTime() -
        (149 - i) * 4 * 60 * 60 * 1000
    );

    const timestamp =
      createISTTimestamp(eventDate);

    const severity =
      ["Critical", "High", "Medium", "Low"][
        i % 4
      ];

    const status =
      ["Open", "Investigating", "Resolved"][
        i % 3
      ];

    const protocol =
      ["TCP", "UDP", "HTTP", "HTTPS", "ICMP"][
        i % 5
      ];

    const eventType =
      [
        "Brute Force",
        "Malware",
        "Port Scan",
        "Data Exfiltration",
        "Unauthorized Access",
        "Suspicious Login",
      ][i % 6];

    const riskBase = {
      Critical: 88,
      High: 70,
      Medium: 48,
      Low: 25,
    };

    const riskScore = Math.min(
      99,
      Math.max(
        8,
        riskBase[severity] +
          ((i * 11) % 13) -
          6
      )
    );

    const base =
      baseEvents[
        i % baseEvents.length
      ] || {};

    events.push({
      ...base,

      id: `SEC-${String(
        i + 1
      ).padStart(4, "0")}`,

      timestamp,

      source: `192.168.${
        10 + (i % 15)
      }.${20 + (i % 220)}`,

      destination: `10.0.${
        i % 12
      }.${10 + (i % 200)}`,

      eventType,

      severity,

      status,

      protocol,

      riskScore,
    });
  }

  return events;
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  ).format(new Date(timestamp));
}

function getSeverityClass(severity) {
  return severity
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getStatusClass(status) {
  return status
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function App() {
  const [events] = useState(
    generateEvents
  );

  const [range, setRange] =
    useState("24H");

  const [search, setSearch] =
    useState("");

  const [severity, setSeverity] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [protocol, setProtocol] =
    useState("All");

  const [sortField, setSortField] =
    useState("timestamp");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [page, setPage] =
    useState(1);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [kpiView, setKpiView] =
    useState(null);

  const summary = useMemo(() => {
    const total =
      events.length;

    const critical =
      events.filter(
        (event) =>
          event.severity ===
          "Critical"
      ).length;

    const high =
      events.filter(
        (event) =>
          event.severity ===
          "High"
      ).length;

    const open =
      events.filter(
        (event) =>
          event.status ===
          "Open"
      ).length;

    const averageRisk =
      Math.round(
        events.reduce(
          (sum, event) =>
            sum +
            event.riskScore,
          0
        ) / total
      );

    return {
      total,
      critical,
      high,
      open,
      averageRisk,
    };
  }, [events]);

  const filteredEvents =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const result =
        events.filter(
          (event) => {
            const matchesSearch =
              !query ||
              event.id
                .toLowerCase()
                .includes(query) ||
              event.source
                .toLowerCase()
                .includes(query) ||
              event.destination
                .toLowerCase()
                .includes(query) ||
              event.eventType
                .toLowerCase()
                .includes(query);

            const matchesSeverity =
              severity === "All" ||
              event.severity ===
                severity;

            const matchesStatus =
              status === "All" ||
              event.status ===
                status;

            const matchesProtocol =
              protocol === "All" ||
              event.protocol ===
                protocol;

            return (
              matchesSearch &&
              matchesSeverity &&
              matchesStatus &&
              matchesProtocol
            );
          }
        );

      result.sort(
        (a, b) => {
          let value = 0;

          if (
            sortField ===
            "timestamp"
          ) {
            value =
              new Date(
                a.timestamp
              ) -
              new Date(
                b.timestamp
              );
          }

          if (
            sortField ===
            "riskScore"
          ) {
            value =
              a.riskScore -
              b.riskScore;
          }

          if (
            sortField ===
            "severity"
          ) {
            const weight = {
              Critical: 4,
              High: 3,
              Medium: 2,
              Low: 1,
            };

            value =
              weight[
                a.severity
              ] -
              weight[
                b.severity
              ];
          }

          return sortDirection ===
            "asc"
            ? value
            : -value;
        }
      );

      return result;
    }, [
      events,
      search,
      severity,
      status,
      protocol,
      sortField,
      sortDirection,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEvents.length /
        PAGE_SIZE
    )
  );

  const safePage = Math.min(
    page,
    totalPages
  );

  const start =
    (safePage - 1) *
    PAGE_SIZE;

  const visibleEvents =
    filteredEvents.slice(
      start,
      start + PAGE_SIZE
    );

 const pages = [];

if (totalPages <= 7) {
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
} else {
  pages.push(1);

  if (safePage <= 4) {
    pages.push(2);
    pages.push(3);
    pages.push(4);
    pages.push(5);
    pages.push("...");
    pages.push(totalPages);
  } else if (safePage >= totalPages - 3) {
    pages.push("...");
    pages.push(totalPages - 4);
    pages.push(totalPages - 3);
    pages.push(totalPages - 2);
    pages.push(totalPages - 1);
    pages.push(totalPages);
  } else {
    pages.push("...");
    pages.push(safePage - 1);
    pages.push(safePage);
    pages.push(safePage + 1);
    pages.push("...");
    pages.push(totalPages);
  }
}

  function handleSort(field) {
    if (
      field === sortField
    ) {
      setSortDirection(
        sortDirection ===
          "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("desc");
    }

    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setSeverity("All");
    setStatus("All");
    setProtocol("All");
    setPage(1);
  }

  /*
   * KPI INVESTIGATION PAGE
   *
   * This uses the exact same events array.
   * No second dataset is created.
   */

  if (kpiView) {
    return (
      <KpiEventsPage
        events={events}
        type={kpiView}
        onBack={() =>
          setKpiView(null)
        }
      />
    );
  }

  return (
    <div className="app">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <div className="header-left">

          <div className="logo">
            <ShieldCheck size={21} />
          </div>

          <div className="brand">

            <strong>
              INNSPARK
            </strong>

            <span>
              SECURITY OPERATIONS
            </span>

          </div>

          <div className="header-line" />

          <span className="header-page">
            Security Event Analytics
          </span>

        </div>

        <div className="header-right">

          <div className="system-health">

            <span className="health-dot" />

            <div>
              <strong>
                Systems Operational
              </strong>

              <span>
                Live monitoring
              </span>
            </div>

          </div>

          <button
            className="refresh-button"
            onClick={() =>
              window.location.reload()
            }
          >
            <RefreshCw size={16} />

            Refresh
          </button>

          <div className="profile">

            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>
                Analyst
              </strong>

              <span>
                Security Team
              </span>
            </div>

            <ChevronDown size={14} />

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">

        {/* PAGE INTRO */}

        <section className="page-intro">

          <div>

            <div className="section-kicker">

              <Activity size={13} />

              SECURITY EVENT MONITORING

            </div>

            <h1>
              Security Event Analytics
            </h1>

            <p>
              Monitor, investigate and
              analyze security activity
              across the environment.
            </p>

          </div>

          <div className="live-status">
            <span />
            LIVE
          </div>

        </section>


        {/* =================================================
            KPI
        ================================================= */}

        <section className="metrics">

          <Metric
            icon={<Database />}
            label="Total Events"
            value={summary.total}
            description="Detected events"
            type="blue"
            clickable
            onClick={() =>
              setKpiView("total")
            }
          />

          <Metric
            icon={<AlertTriangle />}
            label="Critical Events"
            value={summary.critical}
            description="Critical severity"
            type="red"
            clickable
            onClick={() =>
              setKpiView("critical")
            }
          />

          <Metric
            icon={<Target />}
            label="High Severity"
            value={summary.high}
            description="High priority"
            type="orange"
            clickable
            onClick={() =>
              setKpiView("high")
            }
          />

          <Metric
            icon={<Clock3 />}
            label="Open Events"
            value={summary.open}
            description="Awaiting action"
            type="purple"
            clickable
            onClick={() =>
              setKpiView("open")
            }
          />

          <Metric
            icon={<BarChart3 />}
            label="Average Risk"
            value={summary.averageRisk}
            description="Risk score / 100"
            type="green"
          />

        </section>


        {/* =================================================
            ANALYTICS
        ================================================= */}

        <section className="analytics">

          <div className="chart-panel">

            <div className="panel-top">

              <div>

                <span className="panel-kicker">
                  EVENT TREND
                </span>

                <h2>
                  Event activity
                </h2>

                <p>
                  Security events grouped
                  by timestamp.
                </p>

              </div>

              <div className="range-selector">

  <div className="range-label">
    <span>TIME RANGE</span>
    <strong>Event activity period</strong>
  </div>

  <div className="range-tabs">

    <button
      className={
        range === "24H"
          ? "active"
          : ""
      }
      onClick={() => {
        setRange("24H");
        setPage(1);
      }}
    >
      24 Hours
    </button>

    <button
      className={
        range === "7D"
          ? "active"
          : ""
      }
      onClick={() => {
        setRange("7D");
        setPage(1);
      }}
    >
      7 Days
    </button>

    <button
      className={
        range === "30D"
          ? "active"
          : ""
      }
      onClick={() => {
        setRange("30D");
        setPage(1);
      }}
    >
      30 Days
    </button>

  </div>

</div>

            </div>

            <EventChart
              events={events}
              range={range}
            />

          </div>


          {/* THREAT PANEL */}

          <aside className="threat-panel">

            <span className="panel-kicker">
              THREAT OVERVIEW
            </span>

            <h2>
              Security posture
            </h2>

            <div className="risk-number">

              <strong>
                {summary.averageRisk}
              </strong>

              <span>
                /100
              </span>

            </div>

            <div className="risk-track">

              <span
                style={{
                  width: `${summary.averageRisk}%`,
                }}
              />

            </div>

            <span className="risk-caption">
              Average event risk
            </span>

            <div className="threat-list">

              <ThreatStat
                label="Critical"
                value={
                  summary.critical
                }
                className="critical"
              />

              <ThreatStat
                label="High"
                value={
                  summary.high
                }
                className="high"
              />

              <ThreatStat
                label="Open"
                value={
                  summary.open
                }
                className="open"
              />

            </div>

            <div className="monitoring-box">

              <Activity size={16} />

              <div>

                <strong>
                  Continuous monitoring
                </strong>

                <span>
                  Event activity is being
                  analyzed across the
                  selected period.
                </span>

              </div>

            </div>

          </aside>

        </section>


        {/* =================================================
            EVENT MANAGEMENT
        ================================================= */}

        <section className="events-panel">

          <div className="events-title">

            <div>

              <span className="panel-kicker">
                EVENT MANAGEMENT
              </span>

              <h2>
                Security events
              </h2>

              <p>
                Search, filter, sort and
                inspect individual events.
              </p>

            </div>

            <div className="records">
              {filteredEvents.length}
              {" "}
              records
            </div>

          </div>


          {/* FILTER BAR */}

          <div className="filter-bar">

            <div className="search">

              <Search size={17} />

              <input
                value={search}
                placeholder="Search event ID, IP address or event type..."
                onChange={(e) => {
                  setSearch(
                    e.target.value
                  );
                  setPage(1);
                }}
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              )}

            </div>

            <Select
              value={severity}
              setValue={(value) => {
                setSeverity(value);
                setPage(1);
              }}
              options={SEVERITIES}
            />

            <Select
              value={status}
              setValue={(value) => {
                setStatus(value);
                setPage(1);
              }}
              options={STATUSES}
            />

            <Select
              value={protocol}
              setValue={(value) => {
                setProtocol(value);
                setPage(1);
              }}
              options={PROTOCOLS}
            />

            <button
              className="clear-button"
              onClick={resetFilters}
            >
              Clear
            </button>

          </div>


          {/* TABLE */}

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    EVENT
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "timestamp"
                      )
                    }
                    className="clickable"
                  >
                    TIMESTAMP

                    <SortArrow
                      active={
                        sortField ===
                        "timestamp"
                      }
                      direction={
                        sortDirection
                      }
                    />

                  </th>

                  <th>
                    SOURCE
                  </th>

                  <th>
                    DESTINATION
                  </th>

                  <th>
                    EVENT TYPE
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "severity"
                      )
                    }
                    className="clickable"
                  >
                    SEVERITY
                  </th>

                  <th>
                    PROTOCOL
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "riskScore"
                      )
                    }
                    className="clickable"
                  >
                    RISK

                    <SortArrow
                      active={
                        sortField ===
                        "riskScore"
                      }
                      direction={
                        sortDirection
                      }
                    />

                  </th>

                  <th>
                    STATUS
                  </th>

                </tr>

              </thead>

              <tbody>

                {visibleEvents.map(
                  (event) => (

                    <tr
                      key={event.id}
                      onClick={() =>
                        setSelectedEvent(
                          event
                        )
                      }
                    >

                      <td>
                        <span className="event-code">
                          {event.id}
                        </span>
                      </td>

                      <td>
                        <span className="timestamp">
                          {formatTimestamp(
                            event.timestamp
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="ip">
                          {event.source}
                        </span>
                      </td>

                      <td>
                        <span className="ip">
                          {event.destination}
                        </span>
                      </td>

                      <td>
                        <span className="event-type">
                          {event.eventType}
                        </span>
                      </td>

                      <td>

                        <span
                          className={`severity ${getSeverityClass(
                            event.severity
                          )}`}
                        >
                          <i />
                          {
                            event.severity
                          }
                        </span>

                      </td>

                      <td>
                        <span className="protocol">
                          {event.protocol}
                        </span>
                      </td>

                      <td>

                        <div className="risk-cell">

                          <strong>
                            {
                              event.riskScore
                            }
                          </strong>

                          <div className="mini-risk">

                            <span
                              style={{
                                width: `${event.riskScore}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td>

                        <span
                          className={`status ${getStatusClass(
                            event.status
                          )}`}
                        >
                          {
                            event.status
                          }
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

            {visibleEvents.length ===
              0 && (

              <div className="empty">

                <Search size={28} />

                <strong>
                  No events found
                </strong>

                <span>
                  Adjust your filters
                  and try again.
                </span>

              </div>

            )}

          </div>


          {/* PAGINATION */}

          <div className="pagination-row">

            <span>
              Showing{" "}
              {filteredEvents.length ===
              0
                ? 0
                : start + 1}
              {" – "}
              {Math.min(
                start +
                  PAGE_SIZE,
                filteredEvents.length
              )}
              {" of "}
              {filteredEvents.length}
            </span>

            <div className="pagination">

              <button
                disabled={
                  safePage === 1
                }
                onClick={() =>
                  setPage(
                    safePage - 1
                  )
                }
              >
                <ChevronLeft
                  size={16}
                />
              </button>
{pages.map((item, index) => {

  if (item === "...") {
    return (
      <span
        key={`ellipsis-${index}`}
        className="pagination-ellipsis"
      >
        …
      </span>
    );
  }

  return (
    <button
      key={item}
      className={
        safePage === item
          ? "active"
          : ""
      }
      onClick={() =>
        setPage(item)
      }
    >
      {item}
    </button>
  );
})}

              <button
                disabled={
                  safePage ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    safePage + 1
                  )
                }
              >
                <ChevronRight
                  size={16}
                />
              </button>

            </div>

          </div>

        </section>

      </main>


      {/* =================================================
          EXISTING DETAILS DRAWER
      ================================================= */}

      {selectedEvent && (

        <div
          className="drawer-overlay"
          onClick={() =>
            setSelectedEvent(null)
          }
        >

          <aside
            className="drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="drawer-header">

              <div>

                <span>
                  EVENT DETAILS
                </span>

                <h2>
                  {selectedEvent.id}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedEvent(null)
                }
              >
                <X size={18} />
              </button>

            </div>

            <div className="drawer-body">

              <div className="drawer-badges">

                <span
                  className={`severity ${getSeverityClass(
                    selectedEvent.severity
                  )}`}
                >
                  <i />

                  {
                    selectedEvent.severity
                  }

                </span>

                <span
                  className={`status ${getStatusClass(
                    selectedEvent.status
                  )}`}
                >
                  {
                    selectedEvent.status
                  }
                </span>

              </div>

              <div className="drawer-time">

                <span>
                  TIMESTAMP
                </span>

                <strong>
                  {formatTimestamp(
                    selectedEvent.timestamp
                  )}
                </strong>

              </div>


              {/* FLOW */}

              <div className="flow">

                <span className="drawer-label">
                  EVENT FLOW
                </span>

                <div className="flow-card">

                  <div className="flow-item">

                    <span>
                      SOURCE
                    </span>

                    <strong>
                      {
                        selectedEvent.source
                      }
                    </strong>

                  </div>

                  <div className="flow-connector">

                    <span>
                      {
                        selectedEvent.protocol
                      }
                    </span>

                    <div />

                  </div>

                  <div className="flow-item">

                    <span>
                      DESTINATION
                    </span>

                    <strong>
                      {
                        selectedEvent.destination
                      }
                    </strong>

                  </div>

                  <div className="flow-connector">

                    <span>
                      EVENT
                    </span>

                    <div />

                  </div>

                  <div className="flow-item event-flow-item">

                    <span>
                      EVENT TYPE
                    </span>

                    <strong>
                      {
                        selectedEvent.eventType
                      }
                    </strong>

                  </div>

                  <div className="flow-connector">

                    <span>
                      RISK
                    </span>

                    <div />

                  </div>

                  <div className="flow-item risk-flow">

                    <span>
                      RISK SCORE
                    </span>

                    <strong>
                      {
                        selectedEvent.riskScore
                      }

                      <small>
                        /100
                      </small>

                    </strong>

                  </div>

                </div>

              </div>


              {/* DETAILS */}

              <div className="detail-section">

                <span className="drawer-label">
                  EVENT INFORMATION
                </span>

                <div className="detail-grid">

                  <Detail
                    label="Event ID"
                    value={
                      selectedEvent.id
                    }
                  />

                  <Detail
                    label="Event Type"
                    value={
                      selectedEvent.eventType
                    }
                  />

                  <Detail
                    label="Source"
                    value={
                      selectedEvent.source
                    }
                  />

                  <Detail
                    label="Destination"
                    value={
                      selectedEvent.destination
                    }
                  />

                  <Detail
                    label="Protocol"
                    value={
                      selectedEvent.protocol
                    }
                  />

                  <Detail
                    label="Severity"
                    value={
                      selectedEvent.severity
                    }
                  />

                  <Detail
                    label="Status"
                    value={
                      selectedEvent.status
                    }
                  />

                  <Detail
                    label="Risk Score"
                    value={`${selectedEvent.riskScore} / 100`}
                  />

                </div>

              </div>

            </div>

          </aside>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Metric({
  icon,
  label,
  value,
  description,
  type,
  clickable,
  onClick,
}) {
  return (
    <div
      className={`metric ${
        clickable
          ? "metric-clickable"
          : ""
      }`}
      onClick={onClick}
    >

      <div
        className={`metric-icon ${type}`}
      >
        {icon}
      </div>

      <div className="metric-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {description}
        </small>

      </div>

      {clickable && (
        <span className="metric-action">
          View events →
        </span>
      )}

    </div>
  );
}


function ThreatStat({
  label,
  value,
  className,
}) {
  return (
    <div className="threat-stat">

      <div>

        <span
          className={`threat-indicator ${className}`}
        />

        <span>
          {label}
        </span>

      </div>

      <strong>
        {value}
      </strong>

    </div>
  );
}


function Select({
  value,
  setValue,
  options,
}) {
  return (
    <div className="select">

      <select
        value={value}
        onChange={(e) =>
          setValue(
            e.target.value
          )
        }
      >

        {options.map(
          (option) => (

            <option
              value={option}
              key={option}
            >
              {option}
            </option>

          )
        )}

      </select>

      <ChevronDown size={15} />

    </div>
  );
}


function SortArrow({
  active,
  direction,
}) {
  if (!active) {
    return null;
  }

  return (
    <span className="sort-arrow">
      {direction === "asc"
        ? "↑"
        : "↓"}
    </span>
  );
}


function Detail({
  label,
  value,
}) {
  return (
    <div className="detail">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}