import { LOADER_OFF, LOADER_ON } from "./actionTypes";

const initialState = {
    loading: false
}

const loaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADER_ON:
            return ({
                loading: true
            })
        case LOADER_OFF:
            return ({
                loading: false
            })
        default:
            return state;
    }
}

export default loaderReducer;