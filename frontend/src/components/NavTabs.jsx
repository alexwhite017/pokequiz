import { NavLink } from "react-router-dom";

export function NavTabs() {
  const linkClass = ({ isActive }) =>
    `flex-1 border-b-2 py-3 text-center text-sm font-medium transition ${isActive ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"}`;
  return (
    <nav className="flex border-b border-border">
      <NavLink to="/" end className={linkClass}>
        Quiz
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        History
      </NavLink>
    </nav>
  );
}
