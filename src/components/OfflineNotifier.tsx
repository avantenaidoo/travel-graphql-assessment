import { useEffect, useState } from 'react';
import '../styles/components/offlineNotifier.css';
import { formatDate } from '../utils/formatDate';

const OfflineNotifier = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineTime, setOfflineTime] = useState<string | ''>('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      localStorage.removeItem('offlineTime');
    };

    const handleOffline = () => {
      setIsOnline(false);
      const time = new Date().toISOString();
      setOfflineTime(time);
      localStorage.setItem('offlineTime', time);
    };

    if(!navigator.onLine && !offlineTime) {
      const storefOfflineTime = localStorage.getItem('offlineTime');
      if(storefOfflineTime) {
        setOfflineTime(storefOfflineTime);
      }
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineTime]);

  return (
    !isOnline && offlineTime && (
      <div className="offline-notifier">
        <p>You're currently offline since {formatDate(offlineTime)}, live updates may not be available.</p>
      </div>
    )
  );
};

export default OfflineNotifier;