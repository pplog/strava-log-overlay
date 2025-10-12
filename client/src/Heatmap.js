import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, useMapEvents, Pane } from 'react-leaflet';
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hoveredActivityId, setHoveredActivityId] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(0);
  const [elevationFilter, setElevationFilter] = useState(0);
  const mapRef = useRef();
  const listRef = useRef();
  const [clickedActivityId, setClickedActivityId] = useState(null);

  const handlePolylineClick = (activity) => {
    const index = displayedActivities.findIndex(a => a.id === activity.id);
    if (index > -1 && listRef.current) {
      listRef.current.scrollToItem(index);
    }
    setClickedActivityId(activity.id);
  };

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
      setLastUpdated(data.last_updated);
      
      const decodedActivities = data.activities.map(act => ({
        ...act,
        latlngs: polyline.decode(act.polyline)
      }));

      // Log the first activity to inspect its structure
      if (decodedActivities.length > 0) {
        console.log("Sample activity data:", decodedActivities[0]);
      }

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
    const activity = activities.find(act => act.id === activityId);
    if (activity && activity.latlngs && activity.latlngs.length > 0 && mapRef.current) {
      const bounds = L.polyline(activity.latlngs).getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activities]);

  const updateDisplayedActivities = useCallback((mapInstance) => {
    if (activities.length === 0) {
      setDisplayedActivities([]);
      return;
    }

    let finalActivities;

    // If sliders are active, filter all activities by slider values
    if (distanceFilter > 0 || elevationFilter > 0) {
      let filteredBySliders = activities;
      if (distanceFilter > 0) {
        filteredBySliders = filteredBySliders.filter(act => (act.distance / 1000) >= distanceFilter);
      }
      if (elevationFilter > 0) {
        filteredBySliders = filteredBySliders.filter(act => act.total_elevation_gain >= elevationFilter);
      }
      finalActivities = filteredBySliders;
    }
    // Otherwise (sliders are off), filter by map bounds
    else {
      const currentZoom = mapInstance ? mapInstance.getZoom() : 0;
      const bounds = mapInstance ? mapInstance.getBounds() : null;
      const MIN_ZOOM_FOR_FILTERING = 10;

      if (mapInstance && currentZoom >= MIN_ZOOM_FOR_FILTERING && bounds) {
        finalActivities = activities.filter(activity => {
          return activity.latlngs.some(latlng => bounds.contains(L.latLng(latlng[0], latlng[1])));
        });
      } else {
        // If zoomed out, show all activities
        finalActivities = activities;
      }
    }
    setDisplayedActivities(finalActivities);
  }, [activities, distanceFilter, elevationFilter]);

  // Map event listener setup
  const MapEventsHandler = () => {
    const map = useMap();
    useEffect(() => {
      const handler = () => updateDisplayedActivities(map);
      map.on('zoomend', handler);
      map.on('moveend', handler);

      return () => {
        map.off('zoomend', handler);
        map.off('moveend', handler);
      };
    }, [map, updateDisplayedActivities]);
    return null;
  };

  // Update displayedActivities when filters or activities change
  useEffect(() => {
    updateDisplayedActivities(mapRef.current);
  }, [activities, distanceFilter, elevationFilter, updateDisplayedActivities]);

  const AllPolylines = () => {
    return displayedActivities.map(activity => (
      <Polyline 
        key={activity.id} 
        positions={activity.latlngs} 
        color="darkblue" 
        weight={2} 
        opacity={0.7} 
        eventHandlers={{
          click: () => handlePolylineClick(activity),
          mouseover: () => setHoveredActivityId(activity.id),
          mouseout: () => setHoveredActivityId(null),
        }}
      />
    ));
  };

  const HighlightedPolyline = React.memo(({ hoveredId }) => {
    const activity = activities.find(act => act.id === hoveredId);
    if (!activity) return null;
    return <Polyline 
      positions={activity.latlngs} 
      color="#fc5200" 
      weight={5} 
      eventHandlers={{
        click: () => handlePolylineClick(activity),
        mouseout: () => setHoveredActivityId(null),
      }}
    />;
  });

  if (loading) {
    return <p>Loading your activity data... This might take a moment.</p>;
  }

  return (
    <div>
      <MapContainer ref={mapRef} center={[35.681236, 139.767125]} zoom={10} minZoom={2} maxZoom={18} zoomSnap={1} zoomDelta={1} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AllPolylines />
        <HighlightedPolyline hoveredId={hoveredActivityId} />
        <MapEventsHandler />
      </MapContainer>
      <div className="controls">
        <button onClick={() => fetchActivities(true)} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : (
            <>
              Refresh Data
              {lastUpdated && (
                <span style={{ fontSize: '0.7em', color: '#333', display: 'block' }}>
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              )}
            </>
          )}
        </button>
      </div>
      <MemoizedActivityList 
        ref={listRef}
        activities={displayedActivities} 
        onHover={handleActivityHover} 
        onClick={handleActivityClick}
        clickedActivityId={clickedActivityId}
        distanceFilter={distanceFilter}
        elevationFilter={elevationFilter}
        setDistanceFilter={setDistanceFilter}
        setElevationFilter={setElevationFilter}
        totalActivitiesCount={activities.length}
      />
    </div>
  );
};

export default Heatmap;