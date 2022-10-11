import { Action } from "../type";
import Message from "./Message";
import MessageContext from "./MessageContext";

export interface RequestAnalysisMessageContext extends MessageContext {
    readonly content: string;
}

export type AnalysisDeltaOps = {
    delete?: number;
    insert?: string;
};

export type AnalysisDelta = {
    ops: AnalysisDeltaOps[];
};

export type RequestAnalysisMessagePayload = {
    readonly doc_len: number;
    readonly deltas: AnalysisDelta[];
    readonly action: Action;
    readonly rev: number;
    readonly id: number;
};

export class RequestAnalysisMessage implements Message<RequestAnalysisMessageContext, RequestAnalysisMessagePayload> {
    private lastDocumentLength: number = 0;
    build(ctx: RequestAnalysisMessageContext): RequestAnalysisMessagePayload {
        const ops: AnalysisDeltaOps[] = [{ insert: ctx.content }];
        if (this.lastDocumentLength > 0) {
            ops.push({ delete: this.lastDocumentLength });
        }
        const res: RequestAnalysisMessagePayload = {
            doc_len: this.lastDocumentLength,
            deltas: [
                {
                    ops,
                },
            ],
            action: "submit_ot",
            rev: 0,
            id: 0,
        };
        this.lastDocumentLength = ctx.content.length;
        return res;
    }
}
