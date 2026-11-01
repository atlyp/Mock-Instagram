export const handleViewUser = (user, handleNav) => {
    const userId = typeof user === "string" ? user : user?._id;
    if (!userId) return;

    localStorage.setItem("userViewed", JSON.stringify(userId));
    handleNav("/ViewUser", { state: { userViewed: userId } });
};
