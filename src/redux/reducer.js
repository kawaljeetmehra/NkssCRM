import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT
} from "./type";

const initialState = {
     user: {},
     loading:false,
     error: '',
     isAuthenticated: false,
}

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_REQUEST:
           return {
                ...state,
                user:"",
                loading: true,
           }
        case LOGIN_SUCCESS:
           return {
                ...state,
                loading: false,
                user: action.user,
                isAuthenticated:true
           }
        case LOGIN_FAILURE:
           return {
                ...state,
                loading:false,
                error: action.error
           }
        case LOGOUT:
           return {
                user:{},
                loading:false,
                error:'',
                isAuthenticated: false,
           }
        default: return state;
    }
}

export default authReducer;