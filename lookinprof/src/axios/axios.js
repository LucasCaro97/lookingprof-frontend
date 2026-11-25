import axios from 'axios'
import { API_URL } from '../config'

export const api = axios.create({
    baseURL: API_URL,
})

export const getUser = async () => {
    try {
        const response = await api.get('/user/')
        return response
    } catch (error) {
        console.error(error)
    }
}

export const LoginUser = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username,
            password
        })
        return response
    } catch (error) {
        console.log(error)
    }
}
