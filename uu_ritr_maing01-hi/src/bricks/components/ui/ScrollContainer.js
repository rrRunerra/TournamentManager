import "../../../styles/bricks/components/ui/ScrollContainer.css";

/**
 * A reusable scrollable container component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be scrolled
 * @param {number} props.maxHeight - Maximum height in pixels (default: 350)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
export function ScrollContainer({ children, maxHeight = 350, className = "", style = {}, ...props }) {
  return (
    <div className={`scroll-container ${className}`} style={{ maxHeight: `${maxHeight}px`, ...style }} {...props}>
      {children}
    </div>
  );
}

export default ScrollContainer;
