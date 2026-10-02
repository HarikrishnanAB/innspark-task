import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize,
  onPageChange 
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) {
        items.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push("...");
      }
      items.push(totalPages);
    }

    return items;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> events
      </div>

      <div className="pagination-controls">
        <motion.button
          className="pagination-button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </motion.button>

        <div className="pagination-pages">
          {getPaginationItems().map((page, idx) => (
            page === "..." ? (
              <span key={`dots-${idx}`} className="pagination-ellipsis">…</span>
            ) : (
              <motion.button
                key={page}
                className={`pagination-page ${page === currentPage ? "active" : ""}`}
                onClick={() => handlePageClick(page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {page}
              </motion.button>
            )
          ))}
        </div>

        <motion.button
          className="pagination-button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Next page"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

export default Pagination;
