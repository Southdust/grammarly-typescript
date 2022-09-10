import { Action } from "../type";
import Message from "./Message";
import MessageContext from "./MessageContext";

export interface RequestAnalysisMessageContext extends MessageContext {
    readonly content: string;
}

export type RequestAnalysisMessagePayload = {
    readonly ch: string[];
    readonly action: Action;
    readonly rev: number;
    readonly id: number;
};

export class RequestAnalysisMessage implements Message<RequestAnalysisMessageContext, RequestAnalysisMessagePayload> {
    build(ctx: RequestAnalysisMessageContext): RequestAnalysisMessagePayload {
        return {
            ch: [`+0:0:${ctx.content}:0`],
            action: "submit_ot",
            rev: 0,
            id: 0,
        };
    }
}
