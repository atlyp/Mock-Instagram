import { configureStore } from "@reduxjs/toolkit";

import  socialReducer  from "./social";

export const store = configureStore({
  reducer: {
    socialKey: socialReducer,
  },
});


