import { Socket } from "phoenix";

const url = "ws://dd5c-99-21-37-60.ngrok.io"
const socket = new Socket(`${url}/socket`);
socket.connect();
export default socket;
