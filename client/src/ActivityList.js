import React from 'react';
import { FixedSizeList as List } from 'react-window';

// Row component is defined outside to prevent re-creation on every render
const Row = ({ index, style, data }) => {
  const { activities, onHover, onClick } = data;
  const activity = activities[index];

  const openStravaActivity = (e) => {
    e.stopPropagation(); // Prevent the map from moving
    const url = `https://www.strava.com/activities/${activity.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      style={style} 
      className="activity-list-item"
      onClick={() => onClick(activity.id)} // This still moves the map
    >
      <div className="activity-info" onMouseEnter={() => onHover(activity.id)} onMouseLeave={() => onHover(null)}>
        <strong>{activity.name}</strong>
        <small>{new Date(activity.start_date_local).toLocaleDateString()} | {(activity.distance / 1000).toFixed(2)} km | {Math.round(activity.total_elevation_gain)} m</small>
      </div>
      <button className="strava-link-button" onClick={openStravaActivity} title="View on Strava">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
          <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
        </svg>
      </button>
    </div>
  );
};

const ActivityList = ({ 
  activities, 
  onHover, 
  onClick, 
  distanceFilter, 
  elevationFilter, 
  setDistanceFilter, 
  setElevationFilter, 
  totalActivitiesCount 
}) => {

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
        height={window.innerHeight * 0.8 - 150} // Adjust height for filter controls
        itemCount={activities.length}
        itemSize={65} // Approximate height of one list item
        width={'100%'}
        itemData={{ activities, onHover, onClick }} // Pass data to Row component
      >
        {Row}
      </List>
    </div>
  );
};

export default ActivityList;
