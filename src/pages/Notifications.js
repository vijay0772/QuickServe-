import React, { useEffect, useState } from "react";
import "../styles/Notifications.css";  // Assuming you have a CSS file for custom styles
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:3005/fetch-notifications?username=${encodeURIComponent(username)}`);
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                setNotifications(data.data);
            } else {
                console.error('Failed to fetch notifications:', data.message);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <Helmet title="Notifications">
                <CommonSection title="Notifications" />
        <div className="notifications-container">
            {isLoading ? (
                <div className="notification notification-loading">Loading notifications...</div>
            ) : notifications.length > 0 ? (
                <ul className="notification-list">
                    {notifications.map((notification, index) => (
                        <li key={index} className="notification-item">
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-date">{new Date(notification.timestamp).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="notification notification-warning">No new notifications.</div>
            )}
        </div>
        </Helmet>

    );
};

export default Notifications;
