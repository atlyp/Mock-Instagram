import React, { useState } from "react";
import { Button } from "./Button";

export const FollowBtn = ({ onHandleFollow }) => {
  const handleFollow = () => {
    onHandleFollow()
  }
    return (
        <>
                <Button btnText={"Follow"} handleClick={handleFollow} />
           
        </>
    );
};
