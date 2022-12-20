import { Cookie } from "../type";
import Axios from "axios";

export default async function GrabCookies(): Promise<Cookie> {
    const res = await Axios.get("https://grammarly.com/");
    return (res.headers["set-cookie"] ?? []).map((cookie) => cookie.substring(0, cookie.indexOf(";"))).join("; ");
}
