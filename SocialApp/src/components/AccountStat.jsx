import React from "react";

export const AccountStat = ({ statLabel, actualStat }) => {
    return (
        <h3 className=" accountStat p-2  text-lg sm:text-3xl rounded-lg">
            <span className="accountStatLabel  inline-block w-full dark:bg-black bg-black text-white dark:text-white  p-2">
                {statLabel}:{" "}
            </span>
            <span className="accountStatItself text-center p-2 w-full inline-block w-[25%] dark:bg-white dark:text-black">
                {actualStat}
            </span>
        </h3>
    );
};
