import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../redux/social";
import { useNavigate } from "react-router";
export const Avatar = ({ isOpen, onToggle, onClose }) => {
    const { userLoggedInCurrently } = useSelector(
        (state) => state.socialKey,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = () => {
        dispatch(setLogOut());
        localStorage.removeItem("loggedInIndividual");
        navigate("/");
        onClose();
    };

    return (
        <>
            {userLoggedInCurrently.username !== undefined ? (
                <>
                    <button
                        type="button"
                        className="avatarMenuButton relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-neutral-tertiary rounded-full"
                        onClick={onToggle}
                        aria-label="Open account menu"
                        aria-expanded={isOpen}
                        aria-controls="userDropdown"
                    >
                        <span
                            className="font-medium text-body cursor-pointer"
                        >
                            {userLoggedInCurrently.image ? (
                                <img
                                    src={userLoggedInCurrently.image}
                                    alt={`An image for ${userLoggedInCurrently.username}`}
                                />
                            ) : (
                                userLoggedInCurrently.email?.[0] ||
                                userLoggedInCurrently.username[0]
                            )}
                        </span>
                    </button>
                    <div
                        id="userDropdown"
                        className={`z-30 absolute ${isOpen ? "" : "hidden"} bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-52 top-13 right-0`}
                    >
                        <div className="px-4 py-3 border-b border-default-medium text-sm text-heading">
                            <button
                                type="button"
                                onClick={() => {
                                    navigate("/About");
                                    onClose();
                                }}
                                className="block w-full text-left font-medium hover:text-fg-brand"
                            >
                                @{userLoggedInCurrently.username}
                            </button>
                            <div className="truncate">{`${userLoggedInCurrently.email}`}</div>
                        </div>
                        <ul
                            className="p-2 text-sm text-body font-medium"
                            aria-labelledby="avatarButton"
                        >
                            <li>
                                <a
                                    onClick={() => {
                                        navigate("/About");
                                        onClose();
                                    }}
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                                >
                                    Your profile
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                                >
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md"
                                >
                                    Earnings
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={handleLogOut}
                                    href="#"
                                    className="block w-full p-2 hover:bg-neutral-tertiary-medium text-fg-danger rounded-md"
                                >
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                ""
            )}
        </>
    );
};
