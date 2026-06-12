import { fmtNZD } from "../../../shared/utils/formatters";

export default function QuoteSection({
  meters,
  quantity,
  quoteErrors,
  quoteResult,
  onMetersChange,
  onQuantityChange,
  onStepField,
  onClear,
  onCalculate,
}) {
  const totalEx = quoteResult ? quoteResult.costEx + quoteResult.sellEx : 0;
  const totalGST = quoteResult ? quoteResult.costGST + quoteResult.sellGST : 0;
  const totalInc = quoteResult ? quoteResult.costInc + quoteResult.sellInc : 0;

  return (
    <section id="quote" className="page-section">
      <div className="page-content">
        <h2 className="section-heading">Get a Quote</h2>
        <form autoComplete="off" onSubmit={onCalculate}>
          <div className="field-group">
            <label className="field-label" htmlFor="inp-meters">
              Meters
            </label>
            <div className="field-row">
              <button className="step-btn" type="button" onClick={() => onStepField("meters", -1)}>
                -
              </button>
              <input
                className="main-input"
                id="inp-meters"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={meters}
                onChange={onMetersChange}
              />
              <button className="step-btn" type="button" onClick={() => onStepField("meters", 1)}>
                +
              </button>
            </div>
            <div className="error-text" style={{ display: quoteErrors.meters ? "block" : "none" }}>
              Enter a valid decimal number
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="inp-qty">
              Quantity
            </label>
            <div className="field-row">
              <button className="step-btn" type="button" onClick={() => onStepField("qty", -1)}>
                -
              </button>
              <input
                className="main-input"
                id="inp-qty"
                type="number"
                placeholder="0"
                step="1"
                value={quantity}
                onChange={onQuantityChange}
              />
              <button className="step-btn" type="button" onClick={() => onStepField("qty", 1)}>
                +
              </button>
            </div>
            <div className="error-text" style={{ display: quoteErrors.qty ? "block" : "none" }}>
              Enter a whole number
            </div>
          </div>

          <div className="global-error" style={{ display: quoteErrors.global ? "block" : "none" }}>
            Please fix the fields above
          </div>

          <div className="btn-row">
            <button className="btn-primary" type="submit">
              Calculate
            </button>
            <button className="btn-outline" type="button" onClick={onClear}>
              Clear
            </button>
          </div>
        </form>

        <div className="results-card" style={{ display: quoteResult ? "block" : "none" }}>
          <div className="results-grid">
            <div>
              <div className="results-col-title">Cost</div>
              <div className="result-row">
                <span className="result-label">Ex. GST</span>
                <span className="result-value">{quoteResult ? fmtNZD(quoteResult.costEx) : fmtNZD(0)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">GST</span>
                <span className="result-value">{quoteResult ? fmtNZD(quoteResult.costGST) : fmtNZD(0)}</span>
              </div>
              <div className="result-row result-row--total">
                <span className="result-label">Inc. GST</span>
                <span className="result-value result-value--total">
                  {quoteResult ? fmtNZD(quoteResult.costInc) : fmtNZD(0)}
                </span>
              </div>
            </div>

            <div className="results-divider"></div>

            <div>
              <div className="results-col-title">Margin</div>
              <div className="result-row">
                <span className="result-label">Ex. GST</span>
                <span className="result-value">{quoteResult ? fmtNZD(quoteResult.sellEx) : fmtNZD(0)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">GST</span>
                <span className="result-value">{quoteResult ? fmtNZD(quoteResult.sellGST) : fmtNZD(0)}</span>
              </div>
              <div className="result-row result-row--total">
                <span className="result-label">Inc. GST</span>
                <span className="result-value result-value--total">
                  {quoteResult ? fmtNZD(quoteResult.sellInc) : fmtNZD(0)}
                </span>
              </div>
            </div>

            <div className="results-divider"></div>

            <div>
              <div className="results-col-title">Total</div>
              <div className="result-row">
                <span className="result-label">Ex. GST</span>
                <span className="result-value">{fmtNZD(totalEx)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">GST</span>
                <span className="result-value">{fmtNZD(totalGST)}</span>
              </div>
              <div className="result-row result-row--total">
                <span className="result-label">Inc. GST</span>
                <span className="result-value result-value--total">{fmtNZD(totalInc)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
