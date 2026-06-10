const NAV_ITEMS = [
  { id: "home", label: "Home", title: "Home" },
  { id: "quote", label: "Get a Quote", title: "Get a Quote" },
  { id: "vars", label: "Variables", title: "Variables" },
  { id: "edit", label: "Edit Variables", title: "Edit Variables" },
];

export default function Toolbar({ activeSection, onScrollToSection, onLogout }) {
  return (
    <header className="toolbar">
      <span className="toolbar-title">Quote App</span>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`icon-btn ${activeSection === item.id ? "active" : ""}`}
            type="button"
            title={item.title}
            onClick={() => onScrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button className="icon-btn" type="button" title="Log Out" onClick={onLogout}>
          Log Out
        </button>
      </nav>
    </header>
  );
}
