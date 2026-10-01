import { ShieldCheck, Bell } from "lucide-react";

function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>

        <div>
          <strong>Sentinel</strong>
          <span>Security Operations</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="system-status">
          <span className="status-dot" />
          Systems Operational
        </div>

        <button className="icon-button">
          <Bell size={19} />
        </button>

        <div className="avatar">A</div>
      </div>
    </header>
  );
}

export default Header;