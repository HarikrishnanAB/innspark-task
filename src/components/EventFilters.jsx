import { Search, SlidersHorizontal } from "lucide-react";

function EventFilters({
  search,
  setSearch,
  severity,
  setSeverity,
  status,
  setStatus,
}) {
  return (
    <div className="filters">
      <div className="search-box">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search events, IPs, protocols..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-control">
        <SlidersHorizontal size={16} />

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="filter-control">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
    </div>
  );
}

export default EventFilters;