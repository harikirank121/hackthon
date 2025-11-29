import React from 'react';
import { FaCheckCircle, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';
import './DeploymentSection.css';

const deployedLink = 'YOUR_DEPLOYED_URL_HERE'; // TODO: Replace with actual deployed link
const platform = 'YOUR_DEPLOYMENT_PLATFORM_HERE'; // TODO: Replace with actual platform (e.g., Vercel)

const deploymentSteps = [
  'Project build optimized for production',
  'Environment variables set',
  'Deployed static assets and serverless backend',
  'Verified public accessibility and HTTPS encryption',
  'Live health check performed successfully'
];

const DeploymentSection = () => {
  return (
    <div className="deployment-section-card">
      <div className="deployment-title-row">
        <h2>Deployment</h2>
        <span className="deployment-status live">
          <FaCheckCircle /> Live
        </span>
      </div>
      <div className="deployment-meta">
        <span className="deployment-badge accessible">
          <FaGlobe /> Accessible to Anyone
        </span>
        <span className="deployment-platform">Platform: <b>{platform}</b></span>
      </div>
      <div className="deployment-desc">
        <p>The project is deployed successfully and is accessible publicly.</p>
      </div>
      <ol className="deployment-steps">
        {deploymentSteps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
      <a className="deployment-link-btn" href={deployedLink} target="_blank" rel="noopener noreferrer">
        View Live Website <FaExternalLinkAlt style={{ marginLeft: 6 }}/>
      </a>
    </div>
  );
};

export default DeploymentSection;
