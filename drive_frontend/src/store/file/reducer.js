import { DELETE_FILE_ACCESS_SUCCESS, EDIT_FILE_ACCESS_SUCCESS, FILE_ACCESS_LIST_FAILURE, FILE_ACCESS_LIST_SUCCESS, GIVE_FILE_ACCESS_SUCCESS } from "./actionType"

const initialState = {
    loading: false,
    error: null,
    file: {},
    fileAccessList: []
}

export const fileReducer = (state = initialState, action) => {
    switch (action.type) {
        case FILE_ACCESS_LIST_SUCCESS: 
            return {
                ...state,
                loading: false,
                error: null,
                fileAccessList: action?.payload ?? []
            }
        case FILE_ACCESS_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                fileAccessList: []
            }
        case DELETE_FILE_ACCESS_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                fileAccessList: state?.fileAccessList.filter((item) => item.user_email != action.payload.email)
            }
        }

        case GIVE_FILE_ACCESS_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                fileAccessList: [...state?.fileAccessList, {
                    user_email: action?.payload
                }]
            }
        }

        case EDIT_FILE_ACCESS_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                fileAccessList: state?.fileAccessList.map((item) => {
                    if (item.user_email !== action?.payload?.email) {
                        return item;
                    } 
                    return {
                        ...item,
                        expiration_time: action?.payload?.expiration_time
                    }
                })
            }
        }
        default:
            return state
    }
} 