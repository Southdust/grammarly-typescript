import MessageContext from "./MessageContext";
import Message from "./Message";
import { origin, userAgent } from "../http";

export interface AuthorizeMessageContext extends MessageContext {
    readonly cookie: string;
}

export type AuthorizeMessagePayload = {
    readonly origin: string;
    readonly Cookie: string;
    readonly "User-Agent": string;
};

export class AuthorizeMessage implements Message<AuthorizeMessageContext, AuthorizeMessagePayload> {
    build(ctx: AuthorizeMessageContext): AuthorizeMessagePayload {
        return {
            origin,
            Cookie: ctx.cookie,
            "User-Agent": userAgent,
        };
    }
}
