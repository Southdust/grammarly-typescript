import { Dialect, Action } from "../type/";
import Message from "./Message";
import MessageContext from "./MessageContext";

export interface InitializeMessageContext extends MessageContext {
    readonly dialect: Dialect;
}

export type InitializeMessagePayload = {
    readonly type: string;
    readonly token: string | null;
    readonly docid: string;
    readonly client: string;
    readonly protocolVersion: string;
    readonly clientSupports: string[];
    readonly dialect: Dialect;
    readonly clientVersion: string;
    readonly extDomain: string;
    readonly action: Action;
    readonly id: number;
};

export class InitializeMessage implements Message<InitializeMessageContext, InitializeMessagePayload> {
    build(ctx: InitializeMessageContext): InitializeMessagePayload {
        return {
            type: "initial",
            token: null,
            docid: "dfad0927-7b35-e155-6de9-4a107053da35-43543554345",
            client: "extension_chrome",
            protocolVersion: "1.0",
            clientSupports: [
                "free_clarity_alerts",
                "readability_check",
                "filler_words_check",
                "sentence_variety_check",
                "free_occasional_premium_alerts",
            ],
            dialect: ctx.dialect,
            clientVersion: "14.924.2437",
            extDomain: "editpad.org",
            action: "start",
            id: 0,
        };
    }
}
