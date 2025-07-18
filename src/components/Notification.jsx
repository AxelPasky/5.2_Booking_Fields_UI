import React from 'react';
import './Notification.css';

function Notification({ message, type, onClear }) {
  if (!message) {
    return null;
  }

  // Imposta un timer per chiudere automaticamente la notifica
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClear();
    }, 4000); // La notifica scompare dopo 4 secondi

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