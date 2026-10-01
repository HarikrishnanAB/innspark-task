import {
  X,
  ShieldAlert,
  Globe,
  Server,
  Network,
  Activity,
} from "lucide-react";

function EventDetails({ event, onClose }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="event-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className="drawer-label">EVENT DETAILS</span>
            <h2>{event.id}</h2>
          </div>

          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          <div className="risk-highlight">
            <div>
              <span>Risk Score</span>
              <strong>{event.riskScore}</strong>
            </div>

            <div className="risk-circle">
              {event.riskScore}
            </div>
          </div>

          <div className="detail-section">
            <h3>Event Flow</h3>

            <div className="event-flow">
              <div className="flow-node">
                <div>
                  <Globe size={19} />
                </div>
                <span>Source</span>
                <strong>{event.source}</strong>
              </div>

              <div className="flow-line">
                <span />
              </div>

              <div className="flow-node">
                <div>
                  <Network size={19} />
                </div>
                <span>Protocol</span>
                <strong>{event.protocol}</strong>
              </div>

              <div className="flow-line">
                <span />
              </div>

              <div className="flow-node">
                <div>
                  <Server size={19} />
                </div>
                <span>Destination</span>
                <strong>{event.destination}</strong>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Event Information</h3>

            <div className="detail-grid">
              <div>
                <span>Event Type</span>
                <strong>{event.eventType}</strong>
              </div>

              <div>
                <span>Severity</span>
                <strong>{event.severity}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{event.status}</strong>
              </div>

              <div>
                <span>Protocol</span>
                <strong>{event.protocol}</strong>
              </div>

              <div>
                <span>Source</span>
                <strong>{event.source}</strong>
              </div>

              <div>
                <span>Destination</span>
                <strong>{event.destination}</strong>
              </div>

              <div className="full">
                <span>Timestamp</span>
                <strong>
                  {new Date(event.timestamp).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          <div className="investigation-note">
            <Activity size={18} />

            <div>
              <strong>Security Event</strong>
              <p>
                This event has been recorded by the security
                monitoring system and is available for investigation.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default EventDetails;