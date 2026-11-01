import { useEffect, useState } from "react";
import { FaBell, FaHeart, FaUserMinus, FaUserPlus } from "react-icons/fa6";
import { apiUrl } from "../config/api";

const notificationCopy = (notification) => {
    if (notification.type === "like") {
        return notification.postTitle
            ? `liked your post “${notification.postTitle}”`
            : "liked your post";
    }
    if (notification.type === "unfollow") return "unfollowed you";
    return "started following you";
};

const NotificationIcon = ({ type }) => {
    if (type === "like") return <FaHeart aria-hidden="true" />;
    if (type === "unfollow") return <FaUserMinus aria-hidden="true" />;
    return <FaUserPlus aria-hidden="true" />;
};

export const NotificationBell = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const unreadCount = notifications.filter(
        (notification) => !notification.read,
    ).length;

    useEffect(() => {
        let isActive = true;
        const loadNotifications = async () => {
            try {
                const response = await fetch(
                    apiUrl(`/notifications/${encodeURIComponent(userId)}`),
                );
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Could not load notifications.");
                }
                if (isActive) {
                    setNotifications(data.notifications);
                    setErrorMessage("");
                }
            } catch (error) {
                if (isActive) {
                    console.error("There was an error loading notifications", error);
                    setErrorMessage("Notifications couldn't be loaded.");
                }
            }
        };

        void loadNotifications();
        const refreshTimer = window.setInterval(loadNotifications, 30000);
        return () => {
            isActive = false;
            window.clearInterval(refreshTimer);
        };
    }, [userId]);

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                apiUrl(
                    `/notifications/${encodeURIComponent(userId)}/${encodeURIComponent(notificationId)}/read`,
                ),
                { method: "PATCH" },
            );
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not update notification.");
            }
            setNotifications((current) =>
                current.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, read: true }
                        : notification,
                ),
            );
        } catch (error) {
            console.error("There was an error marking a notification as read", error);
            setErrorMessage("That notification couldn't be updated.");
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                apiUrl(`/notifications/${encodeURIComponent(userId)}/read-all`),
                { method: "PATCH" },
            );
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not update notifications.");
            }
            setNotifications((current) =>
                current.map((notification) => ({ ...notification, read: true })),
            );
        } catch (error) {
            console.error("There was an error marking notifications as read", error);
            setErrorMessage("Notifications couldn't be updated.");
        }
    };

    return (
        <div className="notificationControl">
            <button
                type="button"
                className="notificationBell"
                aria-label={
                    unreadCount
                        ? `Notifications, ${unreadCount} unread`
                        : "Notifications"
                }
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
            >
                <FaBell aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="notificationBadge" aria-hidden="true">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <section
                    className="notificationPanel"
                    aria-label="Notifications"
                    aria-live="polite"
                >
                    <header className="notificationHeader">
                        <h2>Notifications</h2>
                        {unreadCount > 0 && (
                            <button type="button" onClick={markAllAsRead}>
                                Mark all read
                            </button>
                        )}
                    </header>
                    {errorMessage && (
                        <p className="notificationMessage" role="alert">
                            {errorMessage}
                        </p>
                    )}
                    {!errorMessage && notifications.length === 0 && (
                        <p className="notificationMessage">
                            You’re all caught up. New follows and post likes will show up here.
                        </p>
                    )}
                    <ul className="notificationList">
                        {notifications.map((notification) => (
                            <li
                                key={notification._id}
                                className={`notificationItem ${notification.read ? "" : "isUnread"}`}
                            >
                                <span className={`notificationTypeIcon ${notification.type}`}>
                                    <NotificationIcon type={notification.type} />
                                </span>
                                <button
                                    type="button"
                                    className="notificationText"
                                    onClick={() => markAsRead(notification._id)}
                                    aria-label={`${notification.actorUsername} ${notificationCopy(notification)}`}
                                >
                                    <span>
                                        <strong>@{notification.actorUsername}</strong>{" "}
                                        {notificationCopy(notification)}
                                    </span>
                                    <time dateTime={notification.createdAt}>
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </time>
                                </button>
                                {!notification.read && (
                                    <span className="notificationUnreadDot" aria-label="Unread" />
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};
