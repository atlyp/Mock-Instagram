import React, { useEffect, useState } from "react";
import { FollowBtn } from "./FollowBtn";
import { UnfollowBtn } from "./UnfollowBtn";

export const FollowBtns = ({
    followingThisPerson,
    thePerson,
    myself,
    followLogic,
}) => {
    const [following, setFollowing] = useState(false);
    useEffect(() => {
        setFollowing(followingThisPerson);
    }, []);
    const onHandleFollowLogic = () => {
        if (!following) {
            followLogic();
            return setFollowing(true);
        } else {
            setFollowing(false);
        }
    };
    console.log(following);
    return (
        <>
            {following ? (
                <UnfollowBtn
                    onHandleFollowState={onHandleFollowLogic}
                    them={thePerson}
                    me={myself}
                />
            ) : (
                <FollowBtn onHandleFollow={onHandleFollowLogic} />
            )}
        </>
    );
};
