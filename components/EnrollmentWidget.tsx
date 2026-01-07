import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Notification Types based on requirements
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'Engagement',
    icon: '🎊',
    title: 'Congratulations!',
    message: "You're viewing this while 8 others are too. 3 of them will enroll. Will you?",
  },
  {
    id: 2,
    type: 'Milestone',
    icon: '🎯',
    title: 'MILESTONE:',
    message: "32nd student just enrolled! The next 18 students get a special bonus!",
  },
  {
    id: 3,
    type: 'Trending',
    icon: '🔥',
    title: 'TRENDING:',
    message: "This batch is filling 5 times faster than usual. Don't miss out!",
  },
  {
    id: 4,
    type: 'Progress',
    icon: '✨',
    title: '50% FILLED:',
    message: "Half the batch is already gone. Secure your spot now!",
  },
  {
    id: 5,
    type: 'Recent Activity',
    icon: '⚡',
    title: 'New Enrollment',
    message: "5 people enrolled in the last 2 hours. Only 12 seats remaining!",
  },
  {
    id: 6,
    type: 'Time Pressure',
    icon: '⏰',
    title: 'ALERT:',
    message: "18 students viewing right now. 12 seats left. Act fast!",
  },
  {
    id: 7,
    type: 'Social Proof',
    icon: '👥',
    title: 'High Traffic',
    message: "127 people visited this page today. 23 already enrolled. Join them!",
  },
  {
    id: 8,
    type: 'Scarcity',
    icon: '⚠️',
    title: 'URGENT:',
    message: "Last 10 seats filling up fast! 3 enrollments in the last hour!",
  }
];

const MAX_NOTIFICATIONS_PER_SESSION = 6;
const DISPLAY_DURATION = 6000; // 6 seconds
const INITIAL_DELAY = 15000; // 15 seconds
const MIN_INTERVAL = 180000; // 3 minutes
const MAX_INTERVAL = 360000; // 6 minutes

const EnrollmentWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(NOTIFICATIONS[0]);
  const [timeAgo, setTimeAgo] = useState('Just now');
  const sessionCountRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Session Storage Management
    const storedCount = sessionStorage.getItem('enrollment_notification_count');
    if (storedCount) {
      sessionCountRef.current = parseInt(storedCount, 10);
    } else {
      sessionStorage.setItem('enrollment_notification_count', '0');
    }

    if (sessionCountRef.current >= MAX_NOTIFICATIONS_PER_SESSION) {
      return;
    }

    // Initial Start
    const startTimeout = setTimeout(() => {
      triggerNotification();
    }, INITIAL_DELAY);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const triggerNotification = () => {
    if (sessionCountRef.current >= MAX_NOTIFICATIONS_PER_SESSION) return;

    // Pick random notification
    const randomIndex = Math.floor(Math.random() * NOTIFICATIONS.length);
    setCurrentNotification(NOTIFICATIONS[randomIndex]);
    
    // Randomize "Time Ago" for realism
    const times = ['Just now', '1 min ago', '2 mins ago', 'Just now'];
    setTimeAgo(times[Math.floor(Math.random() * times.length)]);

    // Show
    setIsVisible(true);
    
    // Increment Count
    sessionCountRef.current += 1;
    sessionStorage.setItem('enrollment_notification_count', sessionCountRef.current.toString());

    // Hide after duration
    setTimeout(() => {
      setIsVisible(false);
      scheduleNextNotification();
    }, DISPLAY_DURATION);
  };

  const scheduleNextNotification = () => {
    if (sessionCountRef.current >= MAX_NOTIFICATIONS_PER_SESSION) return;

    const randomInterval = Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1) + MIN_INTERVAL);
    
    timeoutRef.current = setTimeout(() => {
      triggerNotification();
    }, randomInterval);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Even if closed manually, schedule the next one
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    scheduleNextNotification();
  };

  if (sessionCountRef.current > MAX_NOTIFICATIONS_PER_SESSION && !isVisible) return null;

  return (
    <div 
      className={`
        fixed z-[9999] transition-all duration-500 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}
        
        /* Desktop Positioning */
        md:left-5 md:bottom-5 md:w-[380px]
        
        /* Mobile Positioning (Right aligned, higher up to avoid sticky footers) */
        left-4 right-4 bottom-24 md:bottom-5
        
        max-w-[calc(100%-32px)] md:max-w-[380px]
      `}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-start gap-4 relative overflow-hidden group">
        {/* Left Glow Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue/50"></div>

        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-100">
          {currentNotification.icon}
        </div>

        {/* Content */}
        <div className="flex-grow pt-0.5">
          <div className="flex items-start justify-between">
            <h4 className="text-gray-800 font-bold text-sm leading-tight mb-1">
              {currentNotification.title}
            </h4>
          </div>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-1.5">
            {currentNotification.message}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium">{timeAgo}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-[10px] text-brand-blue font-bold cursor-pointer hover:underline">
               Verified
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EnrollmentWidget;