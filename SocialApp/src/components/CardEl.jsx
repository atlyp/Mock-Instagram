import React from "react";
import { Button } from "./Button";

export const CardEl = ({ title, content, children, styles, handleClick, pointer }) => {
    return (
        <div
            className={`cardEl bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs ${styles}`}
        >
            <h5 onClick={handleClick} className={`mb-3 text-3xl   text-heading leading-8 flex font-[bangers] text-pink-500 ${pointer ? "cursor-pointer" : ""}`}>
                {title}{" "}
            </h5>
            <p className="text-body mb-6 text-xl">{content}</p>
            {children}
        </div>
    );
};
