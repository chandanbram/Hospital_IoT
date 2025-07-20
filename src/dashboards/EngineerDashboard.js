const renderModelInsights = () => (
  <div className="panel-card">
    <h3>Federated Learning / AI Controls</h3>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Controls</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Model Version</td>
          <td>
            <select
              value={modelVersion}
              onChange={(e) => setModelVersion(e.target.value)}
            >
              <option>v1.2.3</option>
              <option>v1.1.5</option>
              <option>v1.0.0</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>Training Config</td>
          <td>
            Epochs: <input type="number" value={epochs} onChange={(e) => setEpochs(parseInt(e.target.value))} style={{ width: '50px' }} /> |
            Batch Size: <input type="number" value={batchSize} onChange={(e) => setBatchSize(parseInt(e.target.value))} style={{ width: '50px', marginLeft: '8px' }} />
            <button
              style={{ marginLeft: '12px' }}
              onClick={() => {
                fetch("http://192.168.0.104:5001/api/config", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    version: modelVersion,
                    epochs,
                    batch_size: batchSize
                  })
                })
                .then(res => res.json())
                .then(d => alert("✅ Config updated"))
                .catch(() => alert("❌ Failed to update config"));
              }}
            >
              Update Config
            </button>
          </td>
        </tr>
        <tr>
          <td>Sync Status</td>
          <td>{lastSync}</td>
        </tr>
        <tr>
          <td>Performance</td>
          <td>Accuracy: {accuracy ?? "--"} | Loss: {loss ?? "--"}</td>
        </tr>
        <tr>
          <td>Trigger Training</td>
          <td>
            <button
              className="toggle-btn"
              onClick={() => {
                fetch('http://192.168.0.104:5001/api/trigger_training', {
                  method: 'POST',
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    version: modelVersion,
                    epochs,
                    batch_size: batchSize
                  })
                })
                  .then(res => res.json())
                  .then(data => alert(data.status || 'Training triggered'))
                  .catch(() => alert("❌ Failed to trigger training"));
              }}
            >
              Trigger Now
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
