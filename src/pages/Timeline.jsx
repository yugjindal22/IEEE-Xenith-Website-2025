import React from 'react';
import './Timeline.css';
import Snowfall from 'react-snowfall';

const Timeline = () => {
  const events = [
    {
      title: "Coming Soon",
      date: "Feb 1st to 2nd 2025",
      time: "XX:00 PM",
      description: "Coming Soon",
      location: "JIIT"
    },
    {
      title: "Coming Soon",
      date: "Feb 1st to 2nd 2025",
      time: "XX:00 PM",
      description: "Coming Soon",
      location: "JIIT"
    },
    {
      title: "Coming Soon",
      date: "Feb 1st to 2nd 2025",
      time: "XX:00 PM",
      description: "Coming Soon",
      location: "JIIT"
    },
    {
      title: "Coming Soon",
      date: "Feb 1st to 2nd 2025",
      time: "XX:00 PM",
      description: "Coming Soon",
      location: "JIIT"
    },
    {
      title: "Coming Soon",
      date: "Feb 1st to 2nd 2025",
      time: "XX:00 PM",
      description: "Coming Soon",
      location: "Venue : JIIT"
    },

  ];

  return (
    <div className="timeline-container">
      <Snowfall 
        snowflakeCount={200}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1
        }}
      />
      <h1 className="timeline-title">Timeline</h1>
      <div className="timeline">
        {events.map((event, index) => (
          <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-content">
              <div className="frost-panel">
                <h2>{event.title}</h2>
                <div className="event-time">
                  <span>{event.date}</span>
                  <span>{event.time}</span>
                </div>
                <p>{event.description}</p>
                <div className="location">{event.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;