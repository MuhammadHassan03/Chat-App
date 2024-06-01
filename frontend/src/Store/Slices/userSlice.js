import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    users : [],
    userInfo : null,
    notification: [],
}



const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        checkUserInfo(state, action){
            const userInfoDetails = JSON.parse(localStorage.getItem("userInfo"));
            state.userInfo = userInfoDetails;
        },
        setNotifications(state,action){
            state.notification = [...state.notification, action.payload];
        },
        filterNofitification(state, action){
            state.notification = state.notification.filter(n => n !== action.payload); 
        }
    },
    
})

export const {checkUserInfo, setNotifications, filterNofitification} = userSlice.actions;
export default userSlice.reducer;
