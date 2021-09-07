import { Socket } from "phoenix";

const socket = new Socket("ws://localhost:4000/socket");
export default socket;
