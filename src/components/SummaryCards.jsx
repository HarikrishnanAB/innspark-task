import { motion } from "motion/react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  FolderOpen,
  Gauge,
} from "lucide-react";

function SummaryCards({ stats }) {
  const cards = [
    {
      title: "Total Events",
      value: stats.total,
      icon: Activity,
      description: "Detected events",
      color: "cyan",
    },
    {
      title: "Critical Events",
      value: stats.critical,
      icon: AlertOctagon,
      description: "Require immediate attention",
      color: "red",
    },
    {
      title: "High Severity",
      value: stats.high,
      icon: AlertTriangle,
      description: "High priority events",
      color: "orange",
    },
    {
      title: "Open Events",
      value: stats.open,
      icon: FolderOpen,
      description: "Awaiting resolution",
      color: "purple",
    },
    {
      title: "Average Risk",
      value: `${stats.averageRisk}/100`,
      icon: Gauge,
      description: "Overall risk score",
      color: "yellow",
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <motion.article
            className={`summary-card summary-${card.color}`}
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="summary-top">
              <span>{card.title}</span>
              <motion.div
                className="summary-icon"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon size={18} />
              </motion.div>
            </div>

            <motion.strong
              initial={{ fontSize: "24px" }}
              whileHover={{ fontSize: "26px" }}
            >
              {card.value}
            </motion.strong>

            <small>{card.description}</small>
          </motion.article>
        );
      })}
    </section>
  );
}

export default SummaryCards;