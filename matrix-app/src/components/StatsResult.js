import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from "../api";

const StatsResult = ({ qrResult }) => {
  const nodeApiUrl = process.env.REACT_APP_NODE_API_URL;
  const [nodeToken, setNodeToken] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const nodeToken = await getToken(nodeApiUrl, 'node_api', 'node_password');
        setNodeToken(nodeToken);
        
        const response = await axios.post(`${nodeApiUrl}/matrix/stats`, qrResult, {
          headers: {
            Authorization: `Bearer ${nodeToken}`
          }});
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [qrResult]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div class="response">
      <div><h3>Statistics Result</h3></div>
      <pre><code>{JSON.stringify(stats, null, 2)}</code></pre>
    </div>
  );
};

export default StatsResult;
