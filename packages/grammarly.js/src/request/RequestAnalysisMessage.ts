import { Action } from "../type";
import Message from "./Message";
import MessageContext from "./MessageContext";

export interface RequestAnalysisMessageContext extends MessageContext {
    readonly content: string;
}

export type RequestAnalysisMessagePayload = {
    readonly action: Action;
    readonly ch: string[];
    readonly rev: number;
    readonly id: number;
};

export class RequestAnalysisMessage implements Message<RequestAnalysisMessageContext, RequestAnalysisMessagePayload> {
    build(ctx: RequestAnalysisMessageContext): RequestAnalysisMessagePayload {
        return {
            action: "submit_ot",
            ch: [`+0:0:${ctx.content}:0`],
            rev: 0,
            id: 0,
        };
    }
}
