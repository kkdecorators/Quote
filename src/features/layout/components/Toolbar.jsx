import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home", title: "Home", end: true },
  { to: "/quote", label: "Get a Quote", title: "Get a Quote" },
  { to: "/variables", label: "Variables", title: "Variables" },
];

export default function Toolbar({ onLogout }) {
  return (
    <header className="toolbar">
      <span className="toolbar-title">Quote App</span>
      <nav>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) => `icon-btn ${isActive ? "active" : ""}`}
            title={item.title}
            to={item.to}
            end={item.end}
          >
            {item.label}
          </NavLink>
        ))}
        <button className="icon-btn" type="button" title="Log Out" onClick={onLogout}>
          Log Out
        </button>
      </nav>
    </header>
  );
}
