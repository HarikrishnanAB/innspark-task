import { motion } from "motion/react";
import {
  Bell,
  ChevronDown,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useState } from "react";

function Header() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="top-header">
      <div className="header-left">
        {/* Brand */}
        <motion.div className="brand">
          <motion.div
            className="brand-icon"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(14, 165, 233, 0.3)" }}
          >
            <ShieldCheck size={22} strokeWidth={2} />
          </motion.div>

          <div className="brand-text">
            <div className="brand-name">INNSPARK</div>
            <div className="brand-subtitle">Security Operations</div>
          </div>
        </motion.div>

        <div className="header-divider" />

        {/* Product */}
        <div className="product-context">
          <div className="product-context-title">Security Event Analytics</div>
          <div className="product-context-status">
            <motion.span 
              className="status-dot"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Live monitoring
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <motion.button 
          className="header-icon-button" 
          title="Search"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search size={18} />
        </motion.button>

        {/* System status */}
        <motion.div 
          className="system-status"
          whileHover={{ scale: 1.02 }}
        >
          <span className="system-status-dot" />
          <div>
            <div className="system-status-title">Systems Operational</div>
            <div className="system-status-subtitle">All services running</div>
          </div>
        </motion.div>

        {/* Notifications */}
        <div className="header-menu-wrapper">
          <motion.button 
            className="header-icon-button notification-button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </motion.button>

          {notificationOpen && (
            <motion.div
              className="notification-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="notification-item">Critical event detected</div>
              <div className="notification-item">Port scan from 192.168.1.1</div>
              <div className="notification-item">Malware signature match</div>
            </motion.div>
          )}
        </div>

        {/* User */}
        <div className="header-menu-wrapper">
          <motion.button 
            className="user-menu"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">Analyst</span>
              <span className="user-role">Security Team</span>
            </div>
            <motion.div
              animate={{ rotate: userMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={15} />
            </motion.div>
          </motion.button>

          {userMenuOpen && (
            <motion.div
              className="user-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Settings</div>
              <div className="dropdown-item">Logout</div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;