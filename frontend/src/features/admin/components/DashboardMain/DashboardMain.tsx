import React, { useMemo } from 'react';
import * as mock from '../../../../data/mockData';
import type {
  StatCard,
  QueueItem,
  DeptUtilization,
  Appointment,
} from '../../types/dashboard.types';
import '../../../admin/pages/Dashboard/dashboard.css';

const DashboardView: React.FC = () => {
  const stats = useMemo<StatCard[]>(() => mock.STATS_CARDS, []);
  const queue = useMemo<QueueItem[]>(() => mock.QUEUE_DATA, []);
  const utilization = useMemo<DeptUtilization[]>(() => mock.DEPT_UTILIZATION, []);
  const appointments = useMemo<Appointment[]>(() => mock.RECENT_APPOINTMENTS, []);

  return (
    <div className="dashboard-container">
      {/* Header View */}
      <header className="dashboard-header">
        <div className="header-meta">
          <h1>Hospital Overview</h1>
          <p className="subtitle">Real-time clinical throughput and operational intelligence</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline">
            <span className="icon">📅</span> Last 24 Hours
          </button>
          <button className="btn-primary">
            <span className="icon">📥</span> Export Report
          </button>
        </div>
      </header>

      {/* High-Density Metric Grid */}
      <section className="metrics-grid" aria-label="Key Performance Indicators">
        {stats.map((card) => (
          <div key={card.id} className="metric-card">
            <div className="metric-header">
              <span className="metric-title">{card.title}</span>
              <span className={`trend-badge is-${card.status}`}>{card.change}</span>
            </div>
            <div className="metric-body">
              <span className="metric-value">{card.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Primary Insights Row */}
      <div className="dashboard-layout-row">
        {/* Live Patient Queue */}
        <section className="content-card">
          <div className="card-header">
            <div className="header-title-wrap">
              <h3>Live Patient Queue</h3>
              <span className="status-indicator-live">Live</span>
            </div>
            <span className="counter-pill">{queue.length} Waiting</span>
          </div>

          <div className="queue-scroller">
            {queue.map((item) => (
              <div key={item.id} className="queue-row">
                <div className="patient-avatar">
                  {item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="queue-details">
                  <h4>{item.name}</h4>
                  <p>
                    {item.dept} <span className="bullet-sep">•</span> {item.doctor}
                  </p>
                </div>
                <div className="queue-meta">
                  <span className="queue-id">{item.id}</span>
                  {item.priority && <span className="tag-priority">Priority</span>}
                </div>
              </div>
            ))}
          </div>
          <button className="btn-footer">
            Manage Full Queue <span>→</span>
          </button>
        </section>

        {/* Department Utilization */}
        <section className="content-card">
          <div className="card-header">
            <div className="header-title-wrap">
              <h3>Department Utilization</h3>
              <p className="card-subtitle">Active resource allocation by unit</p>
            </div>
          </div>

          <div className="utilization-stack">
            {utilization.map((dept, idx) => (
              <div key={idx} className="util-row">
                <div className="util-info">
                  <span className="dept-name">{dept.name}</span>
                  <span className="dept-percentage">{dept.percentage}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill is-${dept.status || 'normal'}`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Secondary Dynamic Row */}
      <div className="dashboard-layout-row">
        {/* Recent Appointments */}
        <section className="content-card grid-span-large">
          <div className="card-header">
            <h3>Recent Appointments</h3>
            <button className="btn-text">View All</button>
          </div>
          <div className="table-container">
            <table className="interactive-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Assigned Doctor</th>
                  <th>Schedule Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app.id}>
                    <td className="font-medium text-main">{app.patient}</td>
                    <td>{app.doctor}</td>
                    <td className="text-muted">{app.time}</td>
                    <td>
                      <span
                        className={`pill-status status-${app.status.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Panel */}
        <section className="action-hub-card">
          <div className="hub-header">
            <h3>Quick Actions</h3>
            <p>Streamline workflow and patient processing utilities.</p>
          </div>
          <div className="hub-actions">
            <button className="hub-tile">
              <span className="tile-icon">📅</span>
              <div className="tile-content">
                <strong>New Appointment</strong>
                <span>Schedule a new booking slot</span>
              </div>
              <span className="tile-arrow">→</span>
            </button>
            <button className="hub-tile">
              <span className="tile-icon">👤</span>
              <div className="tile-content">
                <strong>Register Patient</strong>
                <span>Intake and process new arrival</span>
              </div>
              <span className="tile-arrow">→</span>
            </button>
            <button className="hub-tile">
              <span className="tile-icon">📄</span>
              <div className="tile-content">
                <strong>Issue Records</strong>
                <span>Compile & release medical files</span>
              </div>
              <span className="tile-arrow">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
