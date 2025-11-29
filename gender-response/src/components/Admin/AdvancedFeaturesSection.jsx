import React from 'react';
import { FaRobot, FaUserShield, FaChartBar, FaComments, FaBell, FaDatabase, FaSyncAlt, FaShieldAlt, FaLock } from 'react-icons/fa';
import './AdvancedFeaturesSection.css';

const features = [
  {
    icon: <FaRobot size={28} color="#4FA9EC" />,
    name: 'CAPTCHA',
    desc: 'Prevents automated bots for secure form submissions.'
  },
  {
    icon: <FaUserShield size={28} color="#8E44AD" />,
    name: 'Role-based Dashboard',
    desc: 'Custom dashboard for Admin, Victim, Counsellor, Legal Advisor.'
  },
  {
    icon: <FaChartBar size={28} color="#27AE60" />,
    name: 'Charts & Analytics',
    desc: 'Insightful graphs and analytics for platform metrics.'
  },
  {
    icon: <FaComments size={28} color="#E67E22" />,
    name: 'Chat Support System',
    desc: 'Real-time messaging for user support and quick responses.'
  },
  {
    icon: <FaBell size={28} color="#F39C12" />,
    name: 'Notifications System',
    desc: 'Instant in-app notifications to keep users updated.'
  },
  {
    icon: <FaDatabase size={28} color="#2980B9" />,
    name: 'MongoDB Integration',
    desc: 'Robust, scalable data storage using MongoDB.'
  },
  {
    icon: <FaSyncAlt size={28} color="#16A085" />,
    name: 'Real-time Data Updates',
    desc: 'Live data syncs across all users without page reloads.'
  },
  {
    icon: <FaLock size={28} color="#34495E" />,
    name: 'Secure Authentication System',
    desc: 'Multi-layer authentication ensures robust security.'
  }
];

const AdvancedFeaturesSection = () => (
  <div className="advanced-features-section">
    <h2>Advanced Features Implemented</h2>
    <div className="features-grid">
      {features.map((feature, i) => (
        <div key={i} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <div className="feature-name">{feature.name}</div>
          <div className="feature-desc">{feature.desc}</div>
          <span className="feature-status">
            <FaShieldAlt size={15} style={{ marginRight: 4, marginTop: -2 }} /> Implemented & Fully Functional
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AdvancedFeaturesSection;
