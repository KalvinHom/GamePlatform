import axios from 'axios';

export function create(user) {
    return axios.post("http://localhost:4000/api/game", user)
}