import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Posts } from "../components/Posts";

export const About = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.socialKey.userLoggedInCurrently);

    if (!user?._id) {
        return (
            <main className="profilePage">
                <section className="profileEmpty">
                    <h1>Your profile</h1>
                    <p>Sign in to see your profile and posts.</p>
                    <button type="button" onClick={() => navigate("/")}>
                        Go to sign in
                    </button>
                </section>
            </main>
        );
    }

    const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username;
    const profileDetails = [
        user.company?.title && {
            label: "Work",
            value: `${user.company.title}${user.company.department ? ` · ${user.company.department}` : ""}${user.company.name ? ` at ${user.company.name}` : ""}`,
        },
        user.university && { label: "Education", value: user.university },
        user.phone && { label: "Phone", value: user.phone },
        user.age && { label: "Age", value: user.age },
    ].filter(Boolean);

    return (
        <main className="profilePage">
            <section className="profileCard" aria-label="Your profile">
                <div className="profileCover" aria-hidden="true" />
                <div className="profileIdentity">
                    <div className="profileAvatar">
                        {user.image ? (
                            <img src={user.image} alt={`${displayName}'s profile`} />
                        ) : (
                            <span aria-hidden="true">
                                {(user.firstName?.[0] || user.username?.[0] || "J").toUpperCase()}
                            </span>
                        )}
                    </div>
                    <span className="profileOwnerBadge">Your profile</span>
                    <h1>{displayName}</h1>
                    <p className="profileUsername">@{user.username}</p>
                    {user.email && <p className="profileEmail">{user.email}</p>}
                    <nav className="profileStats" aria-label="Profile statistics">
                        <button
                            type="button"
                            onClick={() => navigate("/ViewFollowers", { state: { user } })}
                        >
                            <strong>{user.followers?.count ?? 0}</strong>
                            <span>Followers</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/ViewFollowing", { state: { user } })}
                        >
                            <strong>{user.following?.count ?? 0}</strong>
                            <span>Following</span>
                        </button>
                    </nav>
                </div>
                {profileDetails.length > 0 && (
                    <section className="profileDetails" aria-labelledby="profile-details-title">
                        <h2 id="profile-details-title">About you</h2>
                        <dl>
                            {profileDetails.map((detail) => (
                                <div className="profileDetail" key={detail.label}>
                                    <dt>{detail.label}</dt>
                                    <dd>{detail.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}
            </section>
            <section className="profilePosts" aria-label="Your posts">
                <div className="profilePostsHeading">
                    <span className="profilePostsMark" aria-hidden="true">▦</span>
                    <h2>Your posts</h2>
                </div>
                <Posts />
            </section>
        </main>
    );
};
