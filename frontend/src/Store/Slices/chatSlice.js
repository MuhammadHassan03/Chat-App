import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const fetchAgain = createAsyncThunk(
    'chat/fetchAgain',
    async (userInfo) => {
        try {
            const config = {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              }
            }
            const { data } = await axios.get("/api/chat",config);
            return data;
          }
          catch (error) {
            console.log(error.message);
          }
    }
)

const initialState = {
    chats: [],
    selectedChat: null,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        getChats(state, action) {
            state.chats = action.payload;
        },
        setChats(state, action) {
            state.chats = [action.payload, ...state.chats];
        },
        setSelectedChat(state, action) {
            state.selectedChat = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAgain.fulfilled, (state, action) => {
            state.chats = action.payload;
        })
    }
})

export const { getChats, setSelectedChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;
