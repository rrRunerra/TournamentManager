import React from "react";
import "../../../styles/bricks/components/ui/Input.css";

/**
 * Reusable Input component
 * @param {Object} props
 * @param {string} props.type - Input type (text, number, password, email, textarea)
 * @param {string} props.label - Input label
 * @param {string|number} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {boolean} props.autoFocus - Autofocus attribute
 * @param {boolean} props.required - Required attribute
 * @param {number} props.min - Min value for number type
 * @param {number} props.max - Max value for number type
 * @param {function} props.onKeyDown - Key down handler
 * @param {React.Ref} props.inputRef - Ref for the input/textarea
 */
const Input = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  className = "",
  style = {},
  autoFocus = false,
  required = false,
  min,
  max,
  onKeyDown,
  inputRef,
  noMargin = false,
  ...props
}) => {
  const isTextarea = type === "textarea";

  const handleChange = (e) => {
    let val = e.target.value;
    if (type === "number") {
      // Allow only digits
      val = val.replace(/\D/g, "");
    }
    onChange(val);
  };

  const inputProps = {
    value,
    onChange: handleChange,
    placeholder,
    className: `custom-input ${className}`,
    style,
    autoFocus,
    required,
    onKeyDown,
    ref: inputRef,
    ...props,
  };

  return (
    <div className="input-wrapper" style={noMargin ? { marginBottom: 0 } : {}}>
      {label && <label className="input-label">{label}</label>}
      {isTextarea ? <textarea {...inputProps} /> : <input type={type} min={min} max={max} {...inputProps} />}
    </div>
  );
};

export default Input;
