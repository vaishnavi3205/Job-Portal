import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import companyReducer from "./companySlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobReducer,
        company: companyReducer
    }
});

export default store;