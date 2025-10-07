require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${port}/strava/callback`;
const CACHE_DIR = path.join(__dirname, 'cache');

// Helper function to fetch all activities from Strava
const fetchAllStravaActivities = async (accessToken) => {
  let allActivities = [];
  let page = 1;
  const perPage = 200; // Max per page
  console.log('Starting fetch from Strava API...');
  while (true) {
    try {
      console.log(`Fetching page ${page}...`);
      const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.length === 0) {
        break;
      }
      allActivities = allActivities.concat(response.data);
      page++;
    } catch (error) {
      console.error('Error fetching a page of Strava activities:', error.response ? error.response.data : error.message);
      throw error; // Propagate error
    }
  }
  console.log(`Fetch complete. Total activities: ${allActivities.length}`);
  return allActivities;
};

app.get('/', (req, res) => {
  res.send('Hello from the Strava Heatmap App server!');
});

app.get('/strava/auth', (req, res) => {
  const scope = 'read_all,activity:read_all';
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scope}`;
  res.redirect(authUrl);
});

app.get('/strava/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    });
    const { access_token, refresh_token, athlete } = response.data;
    // Use athlete's ID for cache filename
    const cachePath = path.join(CACHE_DIR, `activities_${athlete.id}.json`);
    await fs.writeFile(path.join(CACHE_DIR, `token_${athlete.id}.json`), JSON.stringify({ access_token, refresh_token }));

    res.redirect(`http://localhost:3000?token=${access_token}&athlete_id=${athlete.id}`);
  } catch (error) {
    console.error('Error exchanging auth code for access token:', error.response ? error.response.data : error.message);
    res.status(500).send('Authentication failed.');
  }
});

const getActivities = async (req, res, forceRefresh = false) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const { athlete_id } = req.params;
  const cachePath = path.join(CACHE_DIR, `activities_${athlete_id}.json`);

  if (!forceRefresh) {
    try {
      const cachedData = await fs.readFile(cachePath, 'utf-8');
      const stats = await fs.stat(cachePath);
      console.log('Serving from cache.');
      return res.json({ ...JSON.parse(cachedData), last_updated: stats.mtime });
    } catch (error) {
      // Cache miss, proceed to fetch
      console.log('Cache miss. Fetching from Strava.');
    }
  }

  try {
    const allActivities = await fetchAllStravaActivities(accessToken);

    // Exclude virtual rides
    const nonVirtualActivities = allActivities.filter(activity => activity.type !== 'VirtualRide');
    console.log(`Filtered out virtual rides. Kept ${nonVirtualActivities.length} of ${allActivities.length} activities.`);

    const activities = nonVirtualActivities.map(activity => ({
      id: activity.id,
      name: activity.name,
      distance: activity.distance,
      start_date_local: activity.start_date_local,
      polyline: activity.map.summary_polyline,
    })).filter(activity => activity.polyline);

    await fs.writeFile(cachePath, JSON.stringify({ activities }), 'utf-8');
    console.log('Cache created.');
    res.json({ activities, last_updated: new Date() });
  } catch (error) {
    res.status(500).send('Failed to fetch Strava activities.');
  }
};

app.get('/strava/activities/:athlete_id', (req, res) => getActivities(req, res, false));
app.get('/strava/activities/:athlete_id/refresh', (req, res) => getActivities(req, res, true));

(async () => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to create cache directory:", err);
    process.exit(1);
  }
})();
