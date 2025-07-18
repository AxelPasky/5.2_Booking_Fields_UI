import React from 'react';
import './Notification.css';

function Notification({ message, type, onClear }) {
  if (!message) {
    return null;
  }

 
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClear();
    }, 4000); 

    return () => clearTimeout(timer);
  }, [message, onClear]);

  return (
    <div className={`notification-container ${type}`}>
      <p>{message}</p>
      <button onClick={onClear} className="close-btn">&times;</button>
    </div>
  );
}

export default Notification;