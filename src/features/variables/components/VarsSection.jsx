import { KEYS, LABELS } from "../config/constants";
import { fmtVar } from "../../../shared/utils/formatters";
import { normalizeVars } from "../utils/variables";

export default function VarsSection({ sectionRef, vars, onEditClick }) {
  const normalized = normalizeVars(vars);

  return (
    <section id="vars" className="page-section section-gap" ref={sectionRef}>
      <div className="page-content">
        <h2 className="section-heading">Variables</h2>
        <div className="vars-header">
          <span>Current Variables</span>
          <button className="btn-outline btn-sm" type="button" onClick={onEditClick}>
            Edit
          </button>
        </div>
        <table className="vars-table">
          <thead>
            <tr>
              <th>Label</th>
              <th className="th-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {KEYS.map((key) => (
              <tr key={key}>
                <td>{LABELS[key]}</td>
                <td>{fmtVar(key, normalized[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
