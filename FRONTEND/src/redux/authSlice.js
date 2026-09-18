import { createSlice } from "@reduxjs/toolkit";

let savedUser = null;
try {
    const raw = localStorage.getItem("user");
    if (raw) {
        savedUser = JSON.parse(raw);
    }
} catch (e) {
    console.error("Error reading user from localStorage:", e);
    savedUser = null;
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: savedUser
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            try {
                if (action.payload) {
                    localStorage.setItem("user", JSON.stringify(action.payload));
                } else {
                    localStorage.removeItem("user");
                }
            } catch (e) {
                console.error("Error updating user in localStorage:", e);
            }
        },
        updateUserProfile: (state, action) => {
            if (!state.user) return;
            const updatedProfile = {
                ...state.user.profile,
                ...action.payload.profile
            };
            state.user = {
                ...state.user,
                ...action.payload,
                profile: updatedProfile
            };
            try {
                localStorage.setItem("user", JSON.stringify(state.user));
            } catch (e) {
                console.error("Error saving updated user:", e);
            }
        }
    }
});

export const { 
    setLoading, 
    setUser, 
    updateUserProfile
} = authSlice.actions;

export default authSlice.reducer;