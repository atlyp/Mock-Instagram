import React from "react";

export const Button = ({ btnType, btnText, handleClick, styles }) => {
    return (
        <button
            type={btnType}
            onClick={handleClick}
            className={`text-white bg-dark box-border border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none flex w-[min-content] cursor-pointer ${styles}`}
        >
            {btnText}
        </button>
    );
};
