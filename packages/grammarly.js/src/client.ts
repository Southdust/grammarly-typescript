import WebSocket from "ws";
import * as Request from "./request";
import { EventEmitter } from "events";
import { EventKind } from "./event";
import { Dialect } from "./type";

const Authorize = new Request.AuthorizeMessage();

const Initialize = new Request.InitializeMessage();

const RequestAnalysis = new Request.RequestAnalysisMessage();

export interface GrammarlyClientOptions {
    address: string;
    cookie: string;
}

export class GrammarlyClient {
    private client!: WebSocket;
    private emitter: EventEmitter;
    private options: GrammarlyClientOptions;

    constructor(options: GrammarlyClientOptions) {
        this.emitter = new EventEmitter();
        this.options = options;
    }

    establish(): Promise<void> {
        return new Promise<void>((resolve) => {
            const authorize = Authorize.build({ cookie: this.options.cookie });
            this.client = new WebSocket(this.options.address, {
                origin: authorize.origin,
                headers: {
                    Cookie: authorize.Cookie,
                    "User-Agent": authorize["User-Agent"],
                },
            });
            this.setupEmitter();
            this.client.once("open", () => resolve());
        });
    }

    close() {
        this.client.close();
    }

    private setupEmitter() {
        this.client.on("error", (data: any) => this.emitter.emit("error", data));
        this.client.on("message", (data: any) => this.emitter.emit("message", data));
        this.client.on("close", (data: any) => this.emitter.emit("close", data));
    }

    on(kind: EventKind, callback: (data: any) => void) {
        this.emitter.on(kind, callback);
    }

    once(kind: EventKind, callback: (data: any) => void) {
        this.emitter.once(kind, callback);
    }

    init(dialect: Dialect) {
        this.client.send(JSON.stringify(Initialize.build({ dialect })));
    }

    analyze(content: string) {
        this.client.send(JSON.stringify(RequestAnalysis.build({ content })));
    }
}

export default async function createGrammarlyClient() {
    return new GrammarlyClient({
        address: "wss://capi.grammarly.com/freews",
        cookie: await Request.GrabCookies(),
    });
}
