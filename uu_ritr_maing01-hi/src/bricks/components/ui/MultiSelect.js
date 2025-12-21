import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "../../../styles/bricks/components/ui/MultiSelect.css";

/**
 * Reusable MultiSelect component
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {Array} props.value - Selected values array
 * @param {function} props.onChange - Change handler (returns array)
 * @param {Array} props.options - Array of { value, label } objects
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 */
const MultiSelect = ({
  label,
  value = [],
  onChange,
  options = [],
  className = "",
  style = {},
  noMargin = false,
  minimal = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const selectRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        !event.target.closest(".custom-select-options")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    const handleScroll = (event) => {
      if (event.target.classList?.contains("custom-select-options")) return;
      setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true); // Close on scroll (capture)
    window.addEventListener("resize", () => setIsOpen(false)); // Close on resize

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 5 + window.scrollY,
        left: rect.left + window.scrollX,
        width: minimal ? "200px" : rect.width,
        position: "absolute",
      });
    }
  }, [isOpen, minimal]);

  const handleSelect = (val) => {
    const newValue = value.includes(val) ? value.filter((v) => v !== val) : [...value, val];
    onChange(newValue);
  };

  const getTriggerText = () => {
    if (!value || value.length === 0) return "Select classes...";
    if (value.length === options.length) return "All classes selected";
    if (value.length > 2) return `${value.length} classes selected`;

    return options
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label)
      .join(", ");
  };

  return (
    <div
      className={`select-wrapper ${className}`}
      style={{ ...style, marginBottom: noMargin ? 0 : "1rem", width: minimal ? "auto" : "100%" }}
      ref={selectRef}
    >
      {label && <label className="select-label">{label}</label>}
      <div
        className={`custom-select-container ${isOpen ? "open" : ""} ${minimal ? "minimal" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        {minimal ? (
          <div className={`custom-select-trigger-icon ${value.length > 0 ? "active" : ""}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {value.length > 0 && (
              <div className="badge-check">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="custom-select-trigger">
            <span>{getTriggerText()}</span>
            <div className="select-arrow">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
        {isOpen &&
          createPortal(
            <div className="custom-select-options" style={dropdownStyle}>
              {options.map((opt) => (
                <div
                  key={opt.value}
                  className={`custom-select-option ${value.includes(opt.value) ? "selected" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                >
                  <div className="checkbox">{value.includes(opt.value) && <span>✓</span>}</div>
                  {opt.label}
                </div>
              ))}
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
};

export default MultiSelect;
