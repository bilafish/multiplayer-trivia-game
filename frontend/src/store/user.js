import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  socketID: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setSocketID: (state, action) => {
      state.socketID = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setName, setSocketID } = userSlice.actions;

export default userSlice.reducer;
