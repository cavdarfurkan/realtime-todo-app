import Pocketbase from "pocketbase";

const PB_URL = import.meta.env.VITE_PB_URL;
const PB_PORT = import.meta.env.VITE_PB_PORT;

const pb = new Pocketbase(`${PB_URL}:${PB_PORT}`);

export default pb;
