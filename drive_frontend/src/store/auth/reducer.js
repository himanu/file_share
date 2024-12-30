
import { REGISTER, REGISTER_FAILURE, REGISTER_SUCCESS, LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT, GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS, GET_USERS_SUCCESS, GET_USERS_FAILURE } from "./actionTypes";

const initialState = {
    user: null,
    loading: true,
    error: null,
    users: []
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER:
            return ({
                ...state,
                loading: true,
                error: null
            })
        case LOGIN:
            return ({
                ...state,
                loading: true,
                error: null
            })
        case GET_USER:
            return ({
                ...state,
                loading: true,
                error: null
            })
        case REGISTER_FAILURE:
            return ({
                ...state,
                loading: true,
                error: action.payload
            })
        case LOGIN_FAILURE:
            return ({
                ...state,
                loading: false,
                error: action.payload
            })
        case GET_USER_FAILURE:
            return ({
                ...state,
                loading: false,
                error: action.payload,
                user: null
            })
        case REGISTER_SUCCESS:
            return ({
                ...state,
                loading: false,
                error: null
            })
        case LOGIN_SUCCESS:
            return ({
                ...state,
                loading: false,
                error: null,
                user: action?.payload?.user
            })
        case GET_USER_SUCCESS:
            return ({
                ...state,
                loading: false,
                error: null,
                user: action.payload
            })
        case LOGOUT:
            return ({
                ...initialState,
                loading: false
            })
        case GET_USERS_SUCCESS:
            return ({
                ...state,
                loading: false,
                error: null,
                users: action.payload
            })
        case GET_USERS_FAILURE:
            return ({
                ...state,
                loading: false,
                error: action.payload,
                users: []
            })
        default:
            return state;
    }
}

export default authReducer;