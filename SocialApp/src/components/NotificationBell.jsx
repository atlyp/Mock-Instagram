import { useCallback, useEffect, useRef, useState } from "react";
import {
    FaBell,
    FaHeart,
    FaUserMinus,
    FaUserPlus,
    FaVolumeHigh,
    FaVolumeXmark,
} from "react-icons/fa6";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/api";
import { handleViewUser } from "../utils/handleViewUser";

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

export const NotificationBell = ({ userId, isOpen, onToggle }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [soundEnabled, setSoundEnabled] = useState(
        () => localStorage.getItem("notificationSound") !== "off",
    );
    const knownNotificationIds = useRef(null);
    const audioContext = useRef(null);
    const unreadCount = notifications.filter(
        (notification) => !notification.read,
    ).length;

    const getAudioContext = useCallback(() => {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        if (!audioContext.current) {
            audioContext.current = new AudioContextClass();
        }
        if (audioContext.current.state === "suspended") {
            void audioContext.current.resume();
        }
        return audioContext.current;
    }, []);

    const playNotificationChime = useCallback(() => {
        const context = getAudioContext();
        if (!context) return;

        const now = context.currentTime;
        [880, 1174.66].forEach((frequency, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const startAt = now + index * 0.11;
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, startAt);
            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.28);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(startAt);
            oscillator.stop(startAt + 0.3);
        });
    }, [getAudioContext]);

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
                    const currentIds = new Set(
                        data.notifications.map((notification) => notification._id),
                    );
                    const previousIds = knownNotificationIds.current;
                    const hasNewNotification =
                        previousIds &&
                        data.notifications.some(
                            (notification) =>
                                !previousIds.has(notification._id),
                        );
                    knownNotificationIds.current = currentIds;
                    if (hasNewNotification && soundEnabled) {
                        playNotificationChime();
                    }
                    setNotifications((current) =>
                        data.notifications.map((notification) => ({
                            ...notification,
                            read:
                                notification.read ||
                                current.find(
                                    (existing) =>
                                        existing._id === notification._id,
                                )?.read,
                        })),
                    );
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
    }, [playNotificationChime, soundEnabled, userId]);

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

    const handleBellClick = () => {
        getAudioContext();
        const opening = !isOpen;
        onToggle();
        if (opening && unreadCount > 0) {
            void markAllAsRead();
        }
    };

    const toggleSound = () => {
        getAudioContext();
        setSoundEnabled((enabled) => {
            const nextEnabled = !enabled;
            localStorage.setItem("notificationSound", nextEnabled ? "on" : "off");
            return nextEnabled;
        });
    };

    const handleNotificationClick = async (notification) => {
        await markAsRead(notification._id);
        onToggle();
        handleViewUser(notification.actorId, navigate);
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
                onClick={handleBellClick}
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
                        <div className="notificationHeaderActions">
                            <button
                                type="button"
                                className="notificationSoundToggle"
                                onClick={toggleSound}
                                aria-label={
                                    soundEnabled
                                        ? "Turn notification sound off"
                                        : "Turn notification sound on"
                                }
                                title={
                                    soundEnabled
                                        ? "Turn sound off"
                                        : "Turn sound on"
                                }
                            >
                                {soundEnabled ? (
                                    <FaVolumeHigh aria-hidden="true" />
                                ) : (
                                    <FaVolumeXmark aria-hidden="true" />
                                )}
                            </button>
                            {unreadCount > 0 && (
                                <button type="button" onClick={markAllAsRead}>
                                    Mark all read
                                </button>
                            )}
                        </div>
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
                                    onClick={() =>
                                        handleNotificationClick(notification)
                                    }
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
