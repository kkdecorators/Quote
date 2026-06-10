export default function HomeSection({ sectionRef, onScrollToSection }) {
  return (
    <section id="home" className="page-section section-gap" ref={sectionRef}>
      <div className="home-hero">
        <span className="home-badge">Welcome</span>
        <h1 className="home-title">Quote App</h1>
        <div className="home-sub">
          Fast, accurate quotes for your business. Edit variables, calculate costs,
          and export results instantly.
        </div>
      </div>
      <div className="home-cards">
        <div className="home-card" onClick={() => onScrollToSection("quote")}>
          <div className="home-card-label">Get a Quote</div>
          <div className="home-card-desc">Calculate a quote using your current variables.</div>
        </div>
        <div className="home-card" onClick={() => onScrollToSection("vars")}>
          <div className="home-card-label">Variables</div>
          <div className="home-card-desc">View all calculation variables in a table.</div>
        </div>
        <div className="home-card" onClick={() => onScrollToSection("edit")}>
          <div className="home-card-label">Edit Variables</div>
          <div className="home-card-desc">Change the values used in quote calculations.</div>
        </div>
      </div>
    </section>
  );
}
