import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from "./type";
import axios from 'axios';

export const loginRequest = () => ({
      type: LOGIN_REQUEST
})

export const loginSuccess = (user) => ({
      type: LOGIN_SUCCESS,
      user: user
})

export const loginFailure = (error) => ({
      type: LOGIN_FAILURE,
      error: error
})

export const logoutUser = () => {
    return {
         type:LOGOUT
    }
}

export const login = (credentials) => {
    return async (dispatch) => {
        dispatch(loginRequest());

        try {
            const response = await axios.post(
               "http://localhost:4000/api/auth/login",
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const user = response.data;

            dispatch(loginSuccess(user));
            return user;
        } catch (error) {
            dispatch(loginFailure(error.message));
        }
    };

};
