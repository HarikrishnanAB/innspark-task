import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function EventFilters({
  search,
  setSearch,
  severity,
  setSeverity,
  status,
  setStatus,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClearFilters = () => {
    setSearch("");
    setSeverity("All");
    setStatus("All");
  };

  const hasActiveFilters = search || severity !== "All" || status !== "All";

  return (
    <motion.div 
      className="filters-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="filters">
        <motion.div 
          className="search-box"
          whileFocus="focus"
          variants={{
            focus: {
              borderColor: "#38bdf8",
              boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)"
            }
          }}
        >
          <Search size={17} />

          <input
            type="text"
            placeholder="Search events, IPs, protocols..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <motion.button
              className="clear-search"
              onClick={() => setSearch("")}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          )}
        </motion.div>

        <div className="filter-group">
          <motion.div 
            className="filter-control"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
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
          </motion.div>

          <motion.div 
            className="filter-control"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </motion.div>

          {hasActiveFilters && (
            <motion.button
              className="clear-filters-btn"
              onClick={handleClearFilters}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(248, 113, 113, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default EventFilters;