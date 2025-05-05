import axios from 'axios';
import { loginFailure, loginStart, loginSuccess } from './userRedux';
import { toast } from 'react-toastify';

export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8085/api/v1/customer/login", user);
        if (res.data.status === "success") {
            dispatch(loginSuccess(res.data.data));
        } else {
            toast.error("Email and Password does not match!!!");
        }
    } catch (error) {
        dispatch(loginFailure());
    }
};
