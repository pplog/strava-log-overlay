import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

// Row component is defined outside to prevent re-creation on every render
const Row = ({ index, style, data }) => {
  const { activities, onHover, onClick, clickedActivityId } = data;
  const activity = activities[index];

  const openStravaActivity = (e) => {
    e.stopPropagation(); // Prevent the map from moving
    const url = `https://www.strava.com/activities/${activity.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Add a key to the class name to re-trigger animation on same-item-click
  const itemKey = activity.id === clickedActivityId ? Date.now() : null;

  return (
    <div 
      key={itemKey} // Add key to force re-render and re-trigger animation
      style={style} 
      className={`activity-list-item ${activity.id === clickedActivityId ? 'activity-list-item--clicked' : ''}`}
      onClick={() => onClick(activity.id)} // This still moves the map
    >
      <div className="activity-info" onMouseEnter={() => onHover(activity.id)} onMouseLeave={() => onHover(null)}>
        <strong onClick={openStravaActivity}>{activity.name}</strong>
        <small className="activity-date">{new Date(activity.start_date_local).toLocaleDateString()}</small>
        <div className="activity-stats">
          <span className="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-rulers" viewBox="0 0 16 16">
              <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H2v-1h4v-1H2v-1h4v-1H2v-1h4V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1H1z"/>
            </svg>
            {(activity.distance / 1000).toFixed(2)} km
          </span>
          <span className="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5z"/>
            </svg>
            {Math.round(activity.total_elevation_gain)} m
          </span>
        </div>
      </div>
    </div>
  );
};

const ActivityList = forwardRef(({
  activities, 
  onHover, 
  onClick, 
  distanceFilter, 
  elevationFilter, 
  setDistanceFilter, 
  setElevationFilter, 
  totalActivitiesCount,
  clickedActivityId
}, ref) => {

  const listRef = useRef();

  useImperativeHandle(ref, () => ({
    scrollToItem: (index) => {
      if (listRef.current) {
        listRef.current.scrollToItem(index, 'smart');
      }
    }
  }));

  const isFiltered = distanceFilter > 0 || elevationFilter > 0;

  const resetFilters = () => {
    setDistanceFilter(0);
    setElevationFilter(0);
  };

  return (
    <div className="activity-list">
      <h2>
        {isFiltered 
          ? `Filtered Activities (${activities.length} of ${totalActivitiesCount})` 
          : `Activities (${activities.length})`
        }
      </h2>
      <div className="filter-controls">
        <div>
          <label>Min Distance: {distanceFilter} km</label>
          <input 
            type="range" 
            min="0" 
            max="300" // Max distance in km
            value={distanceFilter} 
            onChange={(e) => setDistanceFilter(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Min Elevation: {elevationFilter} m</label>
          <input 
            type="range" 
            min="0" 
            max="4000" // Max elevation in meters
            step="50"
            value={elevationFilter} 
            onChange={(e) => setElevationFilter(Number(e.target.value))}
          />
        </div>
        {isFiltered && (
          <button onClick={resetFilters} className="reset-button">Reset Filters</button>
        )}
      </div>
      <List
        ref={listRef}
        height={window.innerHeight * 0.8 - 150} // Adjust height for filter controls
        itemCount={activities.length}
        itemSize={90} // Approximate height of one list item
        width={'100%'}
        itemData={{ activities, onHover, onClick, clickedActivityId }} // Pass data to Row component
      >
        {Row}
      </List>
    </div>
  );
});

export default ActivityList;
