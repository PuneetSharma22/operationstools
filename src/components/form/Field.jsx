import PropTypes from "prop-types";
import { labelClass, helperClass, errorClass } from "./formStyles";

/**
 * One labelled form row. Shared by the fuel, restaurant and rent forms, which
 * each used to define an identical private copy of this component.
 *
 * The label element is always rendered — even for an empty `label` string —
 * because the item rows in the restaurant form rely on the blank label to keep
 * their inputs vertically aligned with the first (labelled) row.
 */
export default function Field({ label = "", htmlFor, helper, error, children }) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <p className={errorClass} role="alert">{error}</p>
      ) : (
        helper && <p className={helperClass}>{helper}</p>
      )}
    </div>
  );
}

Field.propTypes = {
  /** Visible label text. Pass "" to keep the layout slot without a caption. */
  label: PropTypes.node,
  /** id of the control this label points at. */
  htmlFor: PropTypes.string,
  /** Muted hint shown under the control when there is no error. */
  helper: PropTypes.node,
  /** Validation message. When set, replaces the helper and is announced. */
  error: PropTypes.string,
  children: PropTypes.node,
};
