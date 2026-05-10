import api from "./api";

export const loginUser = async (data)=>{
    return api.post("api/auth/login",data)
}

export const registerUser = async (data)=>{
    return api.post("api/auth/register",data)
}

export const getProfile = async () => {
    return api.get("api/auth/profile")
}
