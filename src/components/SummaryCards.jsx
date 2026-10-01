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
    },
    {
      title: "Critical Events",
      value: stats.critical,
      icon: AlertOctagon,
      description: "Require immediate attention",
    },
    {
      title: "High Severity",
      value: stats.high,
      icon: AlertTriangle,
      description: "High priority events",
    },
    {
      title: "Open Events",
      value: stats.open,
      icon: FolderOpen,
      description: "Awaiting resolution",
    },
    {
      title: "Average Risk",
      value: `${stats.averageRisk}/100`,
      icon: Gauge,
      description: "Overall risk score",
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className="summary-card" key={card.title}>
            <div className="summary-top">
              <span>{card.title}</span>

              <div className="summary-icon">
                <Icon size={18} />
              </div>
            </div>

            <strong>{card.value}</strong>

            <small>{card.description}</small>
          </article>
        );
      })}
    </section>
  );
}

export default SummaryCards;