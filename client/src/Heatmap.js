import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import ActivityList from './ActivityList';
import './ActivityList.css';

const MemoizedActivityList = React.memo(ActivityList);

const Heatmap = ({ accessToken, athleteId }) => {
  const [activities, setActivities] = useState([]);
  const [displayedActivities, setDisplayedActivities] = useState([]); // New state for filtered activities
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredActivityId, setHoveredActivityId] = useState(null);
  const mapRef = useRef();

  const fetchActivities = useCallback(async (forceRefresh = false) => {
    const endpoint = forceRefresh 
      ? `http://localhost:3001/strava/activities/${athleteId}/refresh`
      : `http://localhost:3001/strava/activities/${athleteId}`;
    
    if (forceRefresh) setRefreshing(true);

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      const decodedActivities = data.activities.map(act => ({
        ...act,
        latlngs: polyline.decode(act.polyline)
      }));

      setActivities(decodedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, athleteId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleActivityHover = useCallback((activityId) => {
    setHoveredActivityId(activityId);
  }, []);

  const handleActivityClick = useCallback((activityId) => {
    console.log('Attempting to open Strava activity via programmatic link click:', activityId);
    const url = `https://www.strava.com/activities/${activityId}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer'; // Security best practice
    document.body.appendChild(link); // Append to body is often necessary for programmatic clicks
    link.click();
    document.body.removeChild(link); // Clean up
  }, []);

  // Function to filter activities based on map bounds and zoom
  const filterActivitiesByMap = useCallback((mapInstance) => {
    if (!mapInstance || activities.length === 0) {
      setDisplayedActivities(activities); // Show all if no map or no activities
      return;
    }

    const currentZoom = mapInstance.getZoom();
    const bounds = mapInstance.getBounds(); // Get current map viewport bounds

    const MIN_ZOOM_FOR_FILTERING = 10; // Define your zoom threshold

    if (currentZoom < MIN_ZOOM_FOR_FILTERING) {
      // If zoomed out, show all activities
      setDisplayedActivities(activities);
    } else {
      // If zoomed in, filter activities
      const filtered = activities.filter(activity => {
        // Check if any point of the activity's polyline is within the current map bounds
        return activity.latlngs.some(latlng => bounds.contains(L.latLng(latlng[0], latlng[1])));
      });
      setDisplayedActivities(filtered);
    }
  }, [activities]); // Recreate if 'activities' changes

  // Map event listener setup
  const MapEventsHandler = () => {
    const map = useMap(); // Get the map instance
    useEffect(() => {
      // Attach event listeners
      map.on('zoomend', () => filterActivitiesByMap(map));
      map.on('moveend', () => filterActivitiesByMap(map));

      // Cleanup
      return () => {
        map.off('zoomend', () => filterActivitiesByMap(map));
        map.off('moveend', () => filterActivitiesByMap(map));
      };
    }, [map, activities, filterActivitiesByMap]); // Dependencies
    return null;
  };

  // Update displayedActivities when activities are loaded initially
  useEffect(() => {
    if (activities.length > 0 && mapRef.current) {
      filterActivitiesByMap(mapRef.current);
    }
  }, [activities, filterActivitiesByMap]);

  const AllPolylines = () => {
    return activities.map(activity => (
      <Polyline 
        key={activity.id} 
        positions={activity.latlngs} 
        color="darkblue" 
        weight={2} 
        opacity={0.7} 
      />
    ));
  };

  const HighlightedPolyline = React.memo(({ hoveredId }) => {
    const activity = activities.find(act => act.id === hoveredId);
    if (!activity) return null;
    return <Polyline positions={activity.latlngs} color="blue" weight={4} />;
  });

  if (loading) {
    return <p>Loading your activity data... This might take a moment.</p>;
  }

  return (
    <div>
      <MapContainer ref={mapRef} center={[35.681236, 139.767125]} zoom={10} minZoom={2} maxZoom={18} zoomSnap={0.1} zoomDelta={0.1} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AllPolylines />
        <HighlightedPolyline hoveredId={hoveredActivityId} />
        <MapEventsHandler /> {/* Add the event handler component */}
      </MapContainer>
      <div className="controls">
        <button onClick={() => fetchActivities(true)} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      <MemoizedActivityList 
        activities={displayedActivities} 
        onHover={handleActivityHover} 
        onClick={handleActivityClick} 
      />
    </div>
  );
};

export default Heatmap;