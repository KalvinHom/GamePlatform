import axios from 'axios';

const url = "http://dd5c-99-21-37-60.ngrok.io"
export function create(user) {
    return axios.post(`${url}/api/game`, user)
}

export function start(code) {
    return axios.post(`${url}/api/game/start`, {code: code})
}