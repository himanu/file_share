import { thunk } from "redux-thunk";

import { combineReducers, legacy_createStore, applyMiddleware } from "redux";
import authReducer from "./auth/reducer";
import loaderReducer from "./loader/reducer";
import { fileReducer } from "./file/reducer";

const rootReducers = combineReducers({
    auth: authReducer,
    loader: loaderReducer,
    file: fileReducer
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));