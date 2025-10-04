import React, { useState, useEffect } from 'react';
import './App.css';
import Heatmap from './Heatmap';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [athleteId, setAthleteId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('athlete_id');
    if (token && id) {
      setAccessToken(token);
      setAthleteId(id);
      // Clean the URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const connectWithStrava = () => {
    window.location.href = 'http://localhost:3001/strava/auth';
  };

  return (
    <div className="App">
      {accessToken && athleteId ? (
        <Heatmap accessToken={accessToken} athleteId={athleteId} />
      ) : (
        <header className="App-header">
          <h1>Strava Log Overlay</h1>
          <button onClick={connectWithStrava}>
            Connect with Strava
          </button>
        </header>
      )}
    </div>
  );
}

export default App;
