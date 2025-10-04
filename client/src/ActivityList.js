import React from 'react';
import { FixedSizeList as List } from 'react-window';

const ActivityList = ({ activities, onHover, onClick }) => {

  const Row = ({ index, style }) => {
    const activity = activities[index];
    return (
      <div 
        style={style} 
        className="activity-list-item"
        onMouseEnter={() => onHover(activity.id)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(activity.id)}
      >
        <strong>{activity.name}</strong>
        <small>{new Date(activity.start_date_local).toLocaleDateString()} | {(activity.distance / 1000).toFixed(2)} km</small>
      </div>
    );
  };

  return (
    <div className="activity-list">
      <h2>Activities ({activities.length})</h2>
      <List
        height={window.innerHeight * 0.8} // Adjust height to fit screen
        itemCount={activities.length}
        itemSize={65} // Approximate height of one list item
        width={'100%'}
      >
        {Row}
      </List>
    </div>
  );
};

export default ActivityList;
