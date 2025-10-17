import { configureStore } from "@reduxjs/toolkit";
import venueReducer from "./venueSlice";
import avReducer from "./addOnsSlice";
import mealsReducer from "./mealsSlice";

const store = configureStore({
  reducer: {
    venue: venueReducer,
    av: avReducer,
    meals: mealsReducer,
    addons: avReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
