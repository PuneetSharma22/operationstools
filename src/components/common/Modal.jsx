import { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

/**
 * Portal-rendered centred dialog used by the bulk-generation and login
 * prompts on the fuel and rent generator pages, which each carried an
 * identical private copy of this component.
 *
 * Closes on Escape or a click on the backdrop, and locks body scroll while
 * open.
 */
export default function Modal({ onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(7,1,31,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeIn 0.18s ease" }}
      onClick={onClose}
    >
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div
        style={{ background: "#fff", borderRadius: 20, maxWidth: wide ? 820 : 480, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  /** Use the 820px shell instead of the default 480px one. */
  wide: PropTypes.bool,
  children: PropTypes.node,
};
