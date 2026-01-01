import { useState, useRef, useEffect } from "react";
import "../../../styles/bricks/components/ui/Combobox.css";

/**
 * Reusable Combobox component (Select + Input)
 * @param {Object} props
 * @param {string} props.label - Label
 * @param {string} props.value - Current value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Array of { value, label } or strings
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {boolean} props.required - Required attribute
 */
const Combobox = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  className = "",
  style = {},
  noMargin = false,
  required = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to { value, label } format
  const normalizedOptions = options.map((opt) => (typeof opt === "object" ? opt : { value: opt, label: opt }));

  // Filter options based on input value
  const filteredOptions = normalizedOptions.filter((opt) => opt.label.toLowerCase().includes(value.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div
      className={`combobox-wrapper ${className}`}
      style={{ ...style, marginBottom: noMargin ? 0 : "1rem" }}
      ref={containerRef}
    >
      {label && <label className="combobox-label">{label}</label>}
      <div className={`custom-combobox-container ${isOpen ? "open" : ""}`}>
        <div className="custom-combobox-input-wrapper">
          <input
            type="text"
            className="custom-combobox-input"
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            required={required}
            {...props}
          />
          <div className="combobox-arrow">
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
        {isOpen && filteredOptions.length > 0 && (
          <div className="custom-combobox-options">
            {filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className={`custom-combobox-option ${opt.value === value ? "selected" : ""}`}
                onClick={() => handleSelect(opt.value)}
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

export default Combobox;
