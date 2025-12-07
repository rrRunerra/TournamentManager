import React from "react";
import "../styles/bricks/pagination.css"
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

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
                    <button
                        className="pagination-previous"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {lsi.previous}
                    </button>
                </li>

                {getPageNumbers().map((page, index) => (
                    <li key={index} className="pagination-item">
                        {page === "..." ? (
                            <span className="pagination-ellipsis">...</span>
                        ) : (
                            <button
                                className={`pagination-link ${currentPage === page ? "is-active" : ""}`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li className="pagination-item">
                    <button
                        className="pagination-next"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {lsi.next}
                    </button>
                </li>
            </ul>
        </nav>
    );
}