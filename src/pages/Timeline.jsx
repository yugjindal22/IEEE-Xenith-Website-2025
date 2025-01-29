import React from 'react';
import './Timeline.css';
import Snowfall from 'react-snowfall';

const Timeline = () => {
  const events = [
    {
      title: "Opening Ceremony",
      date: "Feb 1st 2025",
      time: "1:00 PM - 4:00 PM",
      description: "Welcome to Xenith 2025! Join us for an exciting inauguration featuring keynote speakers, event roadmap unveiling, and networking opportunities with tech enthusiasts.",
      
    },
    {
      title: "Codeascend",
      date: "Feb 1st 2025",
      time: "4:00 PM - 6:30 PM",
      description: " The ultimate challenge of competitive programming! Driven by GeeksforGeeks, CodeAscend ignites the stage with an exciting mini-challenge.",
      
    },
    {
      title: "Hackstreet",
      date: "Feb 1st 2025",
      time: "12:00 PM onwards",
      description: "The ultimate 24-hour online hackathon open to colleges across the nation.",
    
    },

    {
      title: "Shardrift",
      date: "Feb 2nd 2025",
      time: "10:00 AM - 1:00 PM",
      description: "An extravaganza of wit, courage, and camaraderie.",
      
    },
    {
      title: "Electrosphere",
      date: "Feb 2nd 2025",
      time: "2:00 PM - 4:00 PM",
      description: " A three level tournament designed to test your mettle and stretch your knowledge to its arctic extremes, culminating in a charging battle of wits.",
    
    },
    {
      title: "IdeateX",
      date: "Feb 2nd 2025",
      time: "2:00 PM - 4:00 PM",
      description: "An innovative Startup Pitch Competition designed for visionaries.",
     
    },
    {
      title: "Closing Ceremony",
      date: "Feb 2nd 2025",
      time: "4:00 PM - 7:00 PM",
      description: "Join us for the grand finale with prize distribution and celebration of this year's achievements. Network one last time before we wrap up!",
      
    }
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