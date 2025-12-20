import { useState, useRef, useEffect } from "react";
import "../../../styles/bricks/components/ui/Select.css";

/**
 * Reusable Select component
 * @param {Object} props
 * @param {string} props.label - Select label
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Array of { value, label } objects
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 */
const Select = ({ label, value, onChange, options = [], className = "", style = {}, noMargin = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      className={`select-wrapper ${className}`}
      style={{ ...style, marginBottom: noMargin ? 0 : "1rem" }}
      ref={selectRef}
    >
      {label && <label className="select-label">{label}</label>}
      <div className={`custom-select-container ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="custom-select-trigger">
          <span>{selectedOption ? selectedOption.label : "Select..."}</span>
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
        {isOpen && (
          <div className="custom-select-options">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`custom-select-option ${opt.value === value ? "selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
