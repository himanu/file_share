import { baseUrl } from "../../constant"
import axios from "axios"
import { DELETE_FILE_ACCESS_FAIL, DELETE_FILE_ACCESS_SUCCESS, EDIT_FILE_ACCESS_SUCCESS, FILE_ACCESS_LIST_FAILURE, FILE_ACCESS_LIST_SUCCESS, GIVE_FILE_ACCESS_SUCCESS } from "./actionType";
import { toast } from "react-toastify";
import { LOADER_OFF, LOADER_ON } from "../loader/actionTypes";

export const getFileAccessList = (fileId, navigate) => async (dispatch) => {
    try {
        const response = await axios.get(`${baseUrl}/file/access?file_id=${fileId}`, {
            withCredentials: true
        });
        dispatch({
            type: FILE_ACCESS_LIST_SUCCESS,
            payload: response?.data?.access_list
        })
    } catch (err) {
        if (err.status == 401)
            navigate("/auth/signin")
        dispatch({
            type: FILE_ACCESS_LIST_FAILURE,
            payload: err.message
        })
    }
}

export const removeFileAccess = (fileId, email, navigate) => async (dispatch) => {
    try {
        await axios.post(`${baseUrl}/file/access`, {
            file_id: fileId,
            user_email: email,
            action: 'remove'
        }, {
            withCredentials: true
        })
        dispatch({
            type: DELETE_FILE_ACCESS_SUCCESS,
            payload: {
                email
            }
        })
    } catch (err) {
        let errorMessage = ''
        if (err.status == 401) {
            navigate("/auth/signin")
            errorMessage = "Session Timeout"
        } else 
            errorMessage = "Something went Wrong"
        toast.error(errorMessage) 
    }
}

export const giveFileAccess = (fileId, email, navigate) => async (dispatch) => {
    try {
        dispatch({
            type:LOADER_ON
        })
        await axios.post(`${baseUrl}/file/access`, {
            file_id: fileId,
            user_email: email,
            action: 'grant'
        }, {
            withCredentials: true
        })
        dispatch({
            type: GIVE_FILE_ACCESS_SUCCESS,
            payload: email
        })
        toast.success("Successfully given Access");
    } catch (err) {
        console.log("Error ", err);
        let errorMessage = ''
        if (err.status == 401) {
            navigate("/auth/signin")
            errorMessage = "Session Timeout"
        } else 
            errorMessage = err?.response?.data?.message ?? "Something went Wrong"
        toast.error(errorMessage) 
    } finally {
        dispatch({
            type:LOADER_OFF
        })
    }
}

export const editFileAccess = (fileId, email, expiration_time, navigate) => async (dispatch) => {
    try {
        dispatch({
            type:LOADER_ON
        })
        const response = await axios.post(`${baseUrl}/file/access`, {
            file_id: fileId,
            user_email: email,
            expiration_time,
            action: 'edit'
        }, {
            withCredentials: true
        })
        dispatch({
            type: EDIT_FILE_ACCESS_SUCCESS,
            payload: {
                email,
                expiration_time: response?.data?.expiration_time
            }
        })
        toast.success(response?.data?.message);
    } catch (err) {
        console.log("Error ", err);
        let errorMessage = ''
        if (err.status == 401) {
            navigate("/auth/signin")
            errorMessage = "Session Timeout"
        } else 
            errorMessage = err?.response?.data?.message ?? "Something went Wrong"
        toast.error(errorMessage) 
    } finally {
        dispatch({
            type:LOADER_OFF
        })
    }
}