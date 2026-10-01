import { useMemo, useState } from "react";
import {
  Shield,
  Activity,
  AlertTriangle,
  Search,
  RefreshCw,
} from "lucide-react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import EventChart from "./components/EventChart";
import EventFilters from "./components/EventFilters";
import EventTable from "./components/EventTable";
import EventDetails from "./components/EventDetails";

import baseEvents from "./data/events.json";

function generateEvents() {
  const severities = ["Low", "Medium", "High", "Critical"];
  const statuses = ["Open", "Investigating", "Resolved"];
  const protocols = ["TCP", "UDP", "HTTP", "HTTPS", "SSH"];
  const eventTypes = [
    "Brute Force",
    "Port Scan",
    "Malware",
    "Suspicious Login",
    "Data Exfiltration",
    "SQL Injection",
    "DDoS",
    "Policy Violation",
    "Credential Attack",
  ];

  const result = [];

  for (let i = 0; i < 200; i++) {
    const base = baseEvents[i % baseEvents.length];

    const severity = severities[i % severities.length];
    const status = statuses[(i + 1) % statuses.length];
    const protocol = protocols[i % protocols.length];
    const eventType = eventTypes[i % eventTypes.length];

    const riskMap = {
      Low: 25,
      Medium: 50,
      High: 75,
      Critical: 92,
    };

    result.push({
      ...base,
      id: `SEC-${String(i + 1).padStart(4, "0")}`,
      timestamp: new Date(
        Date.now() - i * 42 * 60 * 1000
      ).toISOString(),
      source: `10.${10 + (i % 20)}.${i % 255}.${10 + (i % 240)}`,
      destination: `10.24.${i % 10}.${10 + (i % 240)}`,
      eventType,
      severity,
      status,
      protocol,
      riskScore: Math.min(
        99,
        Math.max(10, riskMap[severity] + ((i * 7) % 15) - 7)
      ),
    });
  }

  return result;
}

function App() {
  const [events, setEvents] = useState(generateEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [range, setRange] = useState("24h");

  const stats = useMemo(() => {
    const total = events.length;

    const critical = events.filter(
      (event) => event.severity === "Critical"
    ).length;

    const high = events.filter(
      (event) => event.severity === "High"
    ).length;

    const open = events.filter(
      (event) => event.status === "Open"
    ).length;

    const averageRisk =
      total === 0
        ? 0
        : Math.round(
            events.reduce((sum, event) => sum + event.riskScore, 0) /
              total
          );

    return {
      total,
      critical,
      high,
      open,
      averageRisk,
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        Object.values(event).some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const matchesSeverity =
        severity === "All" || event.severity === severity;

      const matchesStatus =
        status === "All" || event.status === status;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [events, search, severity, status]);

  const handleRefresh = () => {
    setEvents(generateEvents());
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard-container">
        <section className="hero-section">
          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              LIVE SECURITY MONITORING
            </div>

            <h1>Security Event Analytics</h1>

            <p>
              Monitor, investigate and analyze security events across
              your infrastructure.
            </p>
          </div>

          <button className="refresh-button" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </section>

        <SummaryCards stats={stats} />

        <section className="dashboard-card chart-card">
          <div className="section-heading">
            <div>
              <div className="heading-icon">
                <Activity size={18} />
              </div>

              <div>
                <h2>Event Trend</h2>
                <p>Security events detected over time</p>
              </div>
            </div>

            <div className="range-selector">
              {[
                ["24h", "Last 24 hours"],
                ["7d", "Last 7 days"],
                ["30d", "Last 30 days"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={range === value ? "active" : ""}
                  onClick={() => setRange(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <EventChart events={events} range={range} />
        </section>

        <section className="dashboard-card events-card">
          <div className="section-heading">
            <div>
              <div className="heading-icon">
                <Shield size={18} />
              </div>

              <div>
                <h2>Security Events</h2>
                <p>
                  Search, filter and investigate detected events
                </p>
              </div>
            </div>

            <div className="event-count">
              {filteredEvents.length} events
            </div>
          </div>

          <EventFilters
            search={search}
            setSearch={setSearch}
            severity={severity}
            setSeverity={setSeverity}
            status={status}
            setStatus={setStatus}
          />

          <EventTable
            events={filteredEvents}
            onSelect={setSelectedEvent}
          />
        </section>
      </main>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

export default App;