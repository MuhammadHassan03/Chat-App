import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./Slices/ChatSlice";
import userSlice from "./Slices/userSlice";

const store = configureStore({
    reducer: {
        chat : chatSlice,
        user : userSlice,
    }
})
export default store;