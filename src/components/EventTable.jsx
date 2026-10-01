import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight } from "lucide-react";

function EventTable({ events, onSelect }) {
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let first = a[sortField];
      let second = b[sortField];

      if (sortField === "timestamp") {
        first = new Date(first).getTime();
        second = new Date(second).getTime();
      }

      if (typeof first === "number") {
        return sortDirection === "asc"
          ? first - second
          : second - first;
      }

      return sortDirection === "asc"
        ? String(first).localeCompare(String(second))
        : String(second).localeCompare(String(first));
    });
  }, [events, sortField, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedEvents.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleEvents = sortedEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setPage(1);
  };

  const severityClass = (value) =>
    `severity severity-${value.toLowerCase()}`;

  const statusClass = (value) =>
    `event-status status-${value
      .toLowerCase()
      .replace(" ", "-")}`;

  return (
    <>
      <div className="table-wrapper">
        <table className="events-table">
          <thead>
            <tr>
              <th>
                <button onClick={() => handleSort("id")}>
                  Event ID <ArrowUpDown size={13} />
                </button>
              </th>

              <th>
                <button onClick={() => handleSort("timestamp")}>
                  Timestamp <ArrowUpDown size={13} />
                </button>
              </th>

              <th>Source</th>
              <th>Destination</th>
              <th>Event Type</th>

              <th>
                <button onClick={() => handleSort("severity")}>
                  Severity <ArrowUpDown size={13} />
                </button>
              </th>

              <th>Protocol</th>

              <th>
                <button onClick={() => handleSort("riskScore")}>
                  Risk Score <ArrowUpDown size={13} />
                </button>
              </th>

              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {visibleEvents.map((event) => (
              <tr
                key={event.id}
                onClick={() => onSelect(event)}
              >
                <td>
                  <span className="event-id">{event.id}</span>
                </td>

                <td>
                  <span className="timestamp">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </td>

                <td className="mono">{event.source}</td>

                <td className="mono">{event.destination}</td>

                <td>{event.eventType}</td>

                <td>
                  <span className={severityClass(event.severity)}>
                    <span />
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
                    <span>{event.riskScore}</span>

                    <div className="risk-bar">
                      <i
                        style={{
                          width: `${event.riskScore}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <span className={statusClass(event.status)}>
                    {event.status}
                  </span>
                </td>

                <td>
                  <ChevronRight size={17} className="row-arrow" />
                </td>
              </tr>
            ))}

            {visibleEvents.length === 0 && (
              <tr>
                <td colSpan="10" className="empty-state">
                  No security events match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          Showing{" "}
          <strong>
            {visibleEvents.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
          </strong>{" "}
          –{" "}
          <strong>
            {Math.min(currentPage * pageSize, sortedEvents.length)}
          </strong>{" "}
          of <strong>{sortedEvents.length}</strong>
        </span>

        <div className="pagination-buttons">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
{Array.from(
  {
    length: Math.min(5, totalPages),
  },
  (_, index) => {
    let pageNumber;

    if (totalPages <= 5) {
      pageNumber = index + 1;
    } else if (currentPage <= 3) {
      pageNumber = index + 1;
    } else if (currentPage >= totalPages - 2) {
      pageNumber = totalPages - 4 + index;
    } else {
      pageNumber = currentPage - 2 + index;
    }

    return (
      <button
        key={pageNumber}
        className={currentPage === pageNumber ? "active" : ""}
        onClick={() => setPage(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  }
)}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default EventTable;