export const handleViewUser = (user, handleNav) => {
    localStorage.setItem("userViewed", JSON.stringify(user));
    handleNav("/ViewUser", { state: { userViewed: user } });
};
