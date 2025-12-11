import React from "react";
import "../styles/bricks/pagination.css";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";
import { Button } from "./atom/Button.js";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const lsi = useLsi(importLsi, ["Pagination"]);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="pagination">
      <ul className="pagination-content">
        <li className="pagination-item">
          <Button
            type="primary-outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ minWidth: "40px", height: "40px" }}
          >
            {lsi.previous}
          </Button>
        </li>

        {getPageNumbers().map((page, index) => (
          <li key={index} className="pagination-item">
            {page === "..." ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <Button
                type="primary-outline"
                onClick={() => onPageChange(page)}
                disabled={currentPage === page}
                style={{
                  minWidth: "40px",
                  height: "40px",
                  backgroundColor: "transparent",
                  border: "1px solid #3a3a5a",
                }}
              >
                {page}
              </Button>
            )}
          </li>
        ))}

        <li className="pagination-item">
          <Button
            type="primary-outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ minWidth: "40px", height: "40px" }}
          >
            {lsi.next}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
