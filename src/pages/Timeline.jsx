import React from 'react';
import './Timeline.css';
import Snowfall from 'react-snowfall';

const Timeline = () => {
  const events = [
    {
      title: "Opening Ceremony",
      date: "Feb 1, 2025",
      time: "10:00 AM",
      description: "Welcome to Xenith'25 - Embark on a journey through the Shards of Frost",
      location: "Auditorium"
    },
    {
      title: "Event 2",
      date: "Feb XX, 2025",
      time: "XX:00 PM",
      description: "Description",
      location: "Venue"
    },
    {
      title: "Event 3",
      date: "Feb XX, 2025",
      time: "XX:00 PM",
      description: "Description",
      location: "Venue"
    },
    {
      title: "Event 4",
      date: "Feb XX, 2025",
      time: "XX:00 PM",
      description: "Description",
      location: "Venue"
    },
    {
      title: "Event 5",
      date: "Feb XX, 2025",
      time: "XX:00 PM",
      description: "Description",
      location: "Venue"
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