import React from 'react';

const features = [
  "Real-Time Health Monitoring Dashboard",
  "Federated Learning in Action",
  "Visual Attention in AI Predictions",
  "Differential Privacy-Powered Explanations",
  "Few-Shot Personalization Engine",
  "Context-Aware Model Adaptation",
  "Secure Key Exchange Simulation",
  "Mutual Authentication with ECC/HMAC",
  "Intrusion Detection & Alert System",
  "End-to-End Encrypted Health Intelligence"
];

const FeaturePanel = () => (
  <div className="left-pane">
    <div className="project-title">CBR CareNet</div>
    <div className="project-title-2">
      A Privacy-Preserving IoT Framework for Smart Healthcare Monitoring
    </div>
    <div className="feature-ticker">
      <ul>
        {[...features, ...features].map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default FeaturePanel;
