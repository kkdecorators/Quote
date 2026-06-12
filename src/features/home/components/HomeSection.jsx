export default function HomeSection({ onNavigate }) {
  return (
    <section id="home" className="page-section">
      <div className="home-hero">
        <span className="home-badge">Welcome</span>
        <h1 className="home-title">Quote App</h1>
        <div className="home-sub">
          Fast, accurate quotes for your business. Edit variables, calculate costs,
          and export results instantly.
        </div>
      </div>
      <div className="home-cards">
        <div className="home-card" onClick={() => onNavigate("/quote")}> 
          <div className="home-card-label">Get a Quote</div>
          <div className="home-card-desc">Calculate a quote using your current variables.</div>
        </div>
        <div className="home-card" onClick={() => onNavigate("/variables")}> 
          <div className="home-card-label">Variables</div>
          <div className="home-card-desc">View and edit calculation variables in one place.</div>
        </div>
      </div>
    </section>
  );
}
