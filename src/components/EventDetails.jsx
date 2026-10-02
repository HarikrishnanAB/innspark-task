import {
  X,
  ShieldAlert,
  Globe,
  Server,
  Network,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

function EventDetails({ event, onClose }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div 
      className="drawer-overlay" 
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
    >
      <motion.aside
        className="event-drawer"
        onClick={(e) => e.stopPropagation()}
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="drawer-header" variants={itemVariants}>
          <div>
            <span className="drawer-label">EVENT DETAILS</span>
            <h2>{event.id}</h2>
          </div>

          <motion.button 
            className="close-button" 
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>

        <motion.div 
          className="drawer-content"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="risk-highlight" variants={itemVariants}>
            <div>
              <span>Risk Score</span>
              <motion.strong
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                {event.riskScore}
              </motion.strong>
            </div>

            <motion.div 
              className="risk-circle"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {event.riskScore}
            </motion.div>
          </motion.div>

          <motion.div className="detail-section" variants={itemVariants}>
            <h3>Event Flow</h3>

            <div className="event-flow">
              <motion.div 
                className="flow-node"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
              >
                <div>
                  <Globe size={19} />
                </div>
                <span>Source</span>
                <strong>{event.source}</strong>
              </motion.div>

              <div className="flow-line">
                <span />
              </div>

              <motion.div 
                className="flow-node"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
              >
                <div>
                  <Network size={19} />
                </div>
                <span>Protocol</span>
                <strong>{event.protocol}</strong>
              </motion.div>

              <div className="flow-line">
                <span />
              </div>

              <motion.div 
                className="flow-node"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
              >
                <div>
                  <Server size={19} />
                </div>
                <span>Destination</span>
                <strong>{event.destination}</strong>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="detail-section" variants={itemVariants}>
            <h3>Event Information</h3>

            <div className="detail-grid">
              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Event Type</span>
                <strong>{event.eventType}</strong>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Severity</span>
                <strong>{event.severity}</strong>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Status</span>
                <strong>{event.status}</strong>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Protocol</span>
                <strong>{event.protocol}</strong>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Source</span>
                <strong>{event.source}</strong>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Destination</span>
                <strong>{event.destination}</strong>
              </motion.div>

              <motion.div className="full" whileHover={{ x: 4 }} transition={{ type: "spring" }}>
                <span>Timestamp</span>
                <strong>
                  {new Date(event.timestamp).toLocaleString()}
                </strong>
              </motion.div>
            </div>
          </motion.div>

          <motion.div className="investigation-note" variants={itemVariants}>
            <Activity size={18} />

            <div>
              <strong>Security Event</strong>
              <p>
                This event has been recorded by the security
                monitoring system and is available for investigation.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.aside>
    </motion.div>
  );
}

export default EventDetails;