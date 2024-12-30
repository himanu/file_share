import axios from "axios"
import { GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS, LOGIN, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT, REGISTER, REGISTER_FAILURE, REGISTER_SUCCESS } from "./actionTypes";
import { baseUrl } from "../../constant";
import { toast } from "react-toastify";
import { LOADER_OFF, LOADER_ON } from "../loader/actionTypes";
import { GET_USERS } from "./actionTypes";
import { GET_USERS_SUCCESS } from "./actionTypes";
import { GET_USERS_FAILURE } from "./actionTypes";


export const register = (userData, navigate) => async (dispatch) => {
    dispatch({
        type: LOADER_ON
    })
    dispatch({
        type: REGISTER
    })
    try {
        await axios.post(`${baseUrl}/auth/register`, userData);
        dispatch({type: REGISTER_SUCCESS});
        toast.success("Signed Up Successfully, Please sign in!");
        navigate("/auth/login")
    } catch(error) {
        dispatch({type: REGISTER_FAILURE, payload: error.message});
        console.log("error ", error?.response?.data?.email?.[0]);
        toast.error(error?.response?.data?.email?.[0] ?? "Something Went Wrong");
    } finally{
        dispatch({
            type: LOADER_OFF
        })
    }
}



export const login = (userData, setOtpScreen) => async (dispatch) => {
    dispatch({
        type: LOADER_ON
    })
    dispatch({
        type: LOGIN
    })
    try {
        await axios.post(`${baseUrl}/auth/login`, userData);
        setOtpScreen(true);
        dispatch({type: LOGIN_SUCCESS, payload: {}});
    } catch(error) {
        dispatch({type: LOGIN_FAILURE, payload: error.message});
    } finally {
        dispatch({
            type: LOADER_OFF
        })
    }
}

export const getUser = (navigate) => async (dispatch) => {
    dispatch({
        type: LOADER_ON
    })
    dispatch({
        type: GET_USER
    })
    try {
        const response = await axios.get(`${baseUrl}/auth/get_user`, {
            withCredentials: true
          });
        const user = response.data;
        dispatch({type: GET_USER_SUCCESS, payload: user});
    } catch(error) {
        dispatch({type: GET_USER_FAILURE, payload: error.message});
        navigate("/auth/signin")
    } finally {
        dispatch({
            type: LOADER_OFF
        })
    }
}

export const getUsers = (navigate) => async (dispatch) => {
    dispatch({
        type: LOADER_ON
    })
    try {
        const response = await axios.get(`${baseUrl}/auth/get_users`, {
            withCredentials: true
          });
        const users = response?.data?.users;
        dispatch({type: GET_USERS_SUCCESS, payload: users});
    } catch(error) {
        dispatch({type: GET_USERS_FAILURE, payload: error.message});
        // console.log("Error ", error);
        // if (error.status === 401) {
        //     document.cookie = "token" + "=" + "" + ";" + "expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        // }
    } finally {
        dispatch({
            type: LOADER_OFF
        })
    }
}

export const logoutUser = (navigate) => async (dispatch) => {
    try {
        dispatch({
            type: LOADER_ON
        })
        await axios.post(`${baseUrl}/auth/logout`, null, {
            withCredentials: true
        })
        dispatch({
            type: LOGOUT
        })
        navigate("/auth/signin")
    } catch {

    } finally {
        dispatch({
            type: LOADER_OFF
        })
    }
}