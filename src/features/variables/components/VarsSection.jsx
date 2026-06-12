import { KEYS, LABELS } from "../config/constants";

export default function VarsSection({
  editVars,
  onStepField,
  onInputChange,
  onSave,
  onCancel,
}) {
  return (
    <section id="vars" className="page-section">
      <div className="page-content">
        <h2 className="section-heading">Edit Variables</h2>
        <div className="vars-header">
          <span>Update Values</span>
        </div>
        <form autoComplete="off" onSubmit={onSave}>
          <div>
            {KEYS.map((key) => (
              <div className="edit-row" key={key}>
                <label className="edit-label" htmlFor={`edit-${key}`}>
                  {LABELS[key]}
                </label>
                <button type="button" className="edit-step-btn" onClick={() => onStepField(key, -1)}>
                  -
                </button>
                <input
                  className="edit-input"
                  id={`edit-${key}`}
                  type="number"
                  step="0.01"
                  value={editVars[key] ?? 0}
                  onChange={(event) => onInputChange(key, event.target.value)}
                />
                <button type="button" className="edit-step-btn" onClick={() => onStepField(key, 1)}>
                  +
                </button>
                <span className="edit-unit">{key === "M" ? "" : "$"}</span>
              </div>
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: "16px" }}>
            <button className="btn-primary" type="submit">
              Save
            </button>
            <button className="btn-outline" type="button" onClick={onCancel}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
