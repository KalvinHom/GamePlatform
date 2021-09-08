import axios from 'axios';

export function create(user) {
    return axios.post("http://localhost:4000/api/game", user)
}

export function join(code, user) {
    return axios.post("http://localhost:4000/api/game/join", {user: user, code: code})
}

export function start(code) {
    return axios.post("http://localhost:4000/api/game/start", {code: code})
}