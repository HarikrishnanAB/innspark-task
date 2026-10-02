import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Activity,
  Globe,
  Server,
  Radio,
  AlertTriangle,
} from "lucide-react";

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
}

function severityClass(severity) {
  return severity.toLowerCase().replace(/\s+/g, "-");
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function KpiEventsPage({
  events,
  type,
  onBack,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const configuration = {
    total: {
      title: "All Security Events",
      description:
        "Complete security event inventory across the monitored environment.",
      filter: () => true,
    },

    critical: {
      title: "Critical Events",
      description:
        "Security events classified as Critical severity requiring immediate attention.",
      filter: (event) => event.severity === "Critical",
    },

    high: {
      title: "High Severity Events",
      description:
        "Security events classified as High severity and requiring investigation.",
      filter: (event) => event.severity === "High",
    },

    open: {
      title: "Open Events",
      description:
        "Security events that are currently open and awaiting resolution.",
      filter: (event) => event.status === "Open",
    },
  };

  const current =
    configuration[type] || configuration.total;

  const filteredEvents = events
    .filter(current.filter)
    .filter((event) => {
      const query = search.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        event.id.toLowerCase().includes(query) ||
        event.source.toLowerCase().includes(query) ||
        event.destination.toLowerCase().includes(query) ||
        event.eventType.toLowerCase().includes(query) ||
        event.protocol.toLowerCase().includes(query)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)
    );

  const itemsPerPage = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEvents.length / itemsPerPage
    )
  );

  const safePage = Math.min(
    page,
    totalPages
  );

  const start =
    (safePage - 1) * itemsPerPage;

  const visibleEvents =
    filteredEvents.slice(
      start,
      start + itemsPerPage
    );

 const paginationItems = [];

if (totalPages <= 7) {
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(i);
  }
} else {
  // Always keep page 1 visible
  paginationItems.push(1);

  if (safePage <= 4) {
    paginationItems.push(2);
    paginationItems.push(3);
    paginationItems.push(4);
    paginationItems.push(5);
    paginationItems.push("...");
    paginationItems.push(totalPages);
  } else if (safePage >= totalPages - 3) {
    paginationItems.push("...");
    paginationItems.push(totalPages - 4);
    paginationItems.push(totalPages - 3);
    paginationItems.push(totalPages - 2);
    paginationItems.push(totalPages - 1);
    paginationItems.push(totalPages);
  } else {
    paginationItems.push("...");
    paginationItems.push(safePage - 1);
    paginationItems.push(safePage);
    paginationItems.push(safePage + 1);
    paginationItems.push("...");
    paginationItems.push(totalPages);
  }
}

  return (
    <main className="kpi-events-page">

      {/* TOP BAR */}

      <div className="kpi-page-top">

        <button
          className="back-analytics"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back to Analytics
        </button>

        <div className="kpi-page-context">
          SECURITY EVENT INVESTIGATION
        </div>

      </div>


      {/* PAGE HEADER */}

      <section className="kpi-page-header">

        <div className="kpi-page-heading">

          <div className="kpi-page-icon">
            <ShieldAlert size={22} />
          </div>

          <div>

            <div className="section-kicker">
              EVENT MANAGEMENT
            </div>

            <h1>
              {current.title}
            </h1>

            <p>
              {current.description}
            </p>

          </div>

        </div>


        <div className="kpi-result-summary">

          <strong>
            {filteredEvents.length}
          </strong>

          <span>
            matching events
          </span>

        </div>

      </section>


      {/* SEARCH */}

      <section className="kpi-filter-panel">

        <div className="kpi-search">

          <Search size={17} />

          <input
            value={search}
            placeholder="Search event ID, IP address, event type or protocol..."
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
            >
              <X size={14} />
            </button>
          )}

        </div>

        <div className="kpi-filter-info">
          Showing {filteredEvents.length} events
        </div>

      </section>


      {/* EVENT TABLE */}

      <section className="kpi-table-panel">

        <div className="kpi-table-container">

          <table>

            <thead>

              <tr>
                <th>EVENT</th>
                <th>TIMESTAMP</th>
                <th>SOURCE</th>
                <th>DESTINATION</th>
                <th>EVENT TYPE</th>
                <th>SEVERITY</th>
                <th>PROTOCOL</th>
                <th>RISK</th>
                <th>STATUS</th>
              </tr>

            </thead>

            <tbody>

              {visibleEvents.map((event) => (

                <tr
                  key={event.id}
                  onClick={() =>
                    setSelectedEvent(event)
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
                      className={`severity ${severityClass(
                        event.severity
                      )}`}
                    >
                      <i />
                      {event.severity}
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
                        {event.riskScore}
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
                      className={`status ${statusClass(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {visibleEvents.length === 0 && (

            <div className="kpi-empty">

              <Search size={28} />

              <strong>
                No matching events
              </strong>

              <span>
                Try another search term.
              </span>

            </div>

          )}

        </div>


        {/* PAGINATION */}

        <div className="pagination-row">

          <span>

            Showing{" "}

            {filteredEvents.length === 0
              ? 0
              : start + 1}

            {" – "}

            {Math.min(
              start + itemsPerPage,
              filteredEvents.length
            )}

            {" of "}

            {filteredEvents.length}

          </span>


          <div className="pagination">

            <button
              disabled={safePage === 1}
              onClick={() =>
                setPage(safePage - 1)
              }
            >
              <ChevronLeft size={16} />
            </button>

{paginationItems.map((item, index) => {

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
                safePage === totalPages
              }
              onClick={() =>
                setPage(safePage + 1)
              }
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </section>


      {/* EVENT DETAILS DRAWER */}

      {selectedEvent && (

        <>

          <div
            className="event-drawer-overlay"
            onClick={() =>
              setSelectedEvent(null)
            }
          />

          <aside className="event-details-drawer">

            <div className="drawer-header">

              <div>

                <span className="drawer-kicker">
                  SECURITY EVENT
                </span>

                <h2>
                  {selectedEvent.id}
                </h2>

              </div>

              <button
                className="drawer-close"
                onClick={() =>
                  setSelectedEvent(null)
                }
              >
                <X size={18} />
              </button>

            </div>


            <div className="drawer-status-row">

              <span
                className={`severity ${severityClass(
                  selectedEvent.severity
                )}`}
              >
                <i />
                {selectedEvent.severity}
              </span>

              <span
                className={`status ${statusClass(
                  selectedEvent.status
                )}`}
              >
                {selectedEvent.status}
              </span>

            </div>


            {/* EVENT FLOW */}

            <div className="event-flow">

              <div className="flow-node">

                <div className="flow-icon">
                  <Globe size={17} />
                </div>

                <span>SOURCE</span>

                <strong>
                  {selectedEvent.source}
                </strong>

              </div>


              <div className="flow-line" />


              <div className="flow-node">

                <div className="flow-icon">
                  <Radio size={17} />
                </div>

                <span>PROTOCOL</span>

                <strong>
                  {selectedEvent.protocol}
                </strong>

              </div>


              <div className="flow-line" />


              <div className="flow-node">

                <div className="flow-icon">
                  <Server size={17} />
                </div>

                <span>DESTINATION</span>

                <strong>
                  {selectedEvent.destination}
                </strong>

              </div>

            </div>


            {/* EVENT INFORMATION */}

            <div className="drawer-section">

              <div className="drawer-section-title">
                EVENT INFORMATION
              </div>

              <div className="drawer-grid">

                <div className="drawer-field">
                  <span>Event Type</span>
                  <strong>
                    {selectedEvent.eventType}
                  </strong>
                </div>

                <div className="drawer-field">
                  <span>Timestamp</span>
                  <strong>
                    {formatTimestamp(
                      selectedEvent.timestamp
                    )}
                  </strong>
                </div>

                <div className="drawer-field">
                  <span>Protocol</span>
                  <strong>
                    {selectedEvent.protocol}
                  </strong>
                </div>

                <div className="drawer-field">
                  <span>Status</span>
                  <strong>
                    {selectedEvent.status}
                  </strong>
                </div>

              </div>

            </div>


            {/* RISK */}

            <div className="drawer-risk">

              <div className="drawer-risk-header">

                <div>

                  <span>
                    RISK SCORE
                  </span>

                  <strong>
                    {selectedEvent.riskScore}
                    <small>/100</small>
                  </strong>

                </div>

                <AlertTriangle size={20} />

              </div>


              <div className="drawer-risk-bar">

                <span
                  style={{
                    width: `${selectedEvent.riskScore}%`,
                  }}
                />

              </div>

            </div>


            {/* EVENT TARGET */}

            <div className="drawer-section">

              <div className="drawer-section-title">
                EVENT TARGET
              </div>

              <div className="drawer-target">

                <Activity size={17} />

                <div>

                  <strong>
                    {selectedEvent.eventType}
                  </strong>

                  <span>
                    Security activity detected
                    between source and destination.
                  </span>

                </div>

              </div>

            </div>

          </aside>

        </>

      )}

    </main>
  );
}