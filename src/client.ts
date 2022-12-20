import { WebSocket, MessageEvent } from "ws";
import * as Request from "./request";
import { Dialect } from "./type";
import { AlertResponse, MergedResult, EmotionsResponse, FinishedResponse, Response } from "./response";

const Authorize = new Request.AuthorizeMessage();

const Initialize = new Request.InitializeMessage();

const RequestAnalysis = new Request.RequestAnalysisMessage();

export type ClosePayload = {
    reason: string;
    code: number;
    type: string;
};

/**
 * The options required to establish a connection to the Grammarly web socket server.
 * @see GrammarlyClient
 */
export interface GrammarlyClientOptions {
    /**
     * The address of the Grammarly web socket server.
     */
    address: string;

    /**
     * The cookie required as request header.
     */
    cookie: string;
}

/**
 * A client consuming the Grammarly API through its web socket server.
 * This works by establishing a connection and sending the requests to the server within the allowed protocol.
 * The way the server works is pretty simple and straightforward:
 * - The Grammarly server expects you to send an `InitializeMessage` as the first message, which will return you
 *   back something similar to this (of course, there's many other fields, but these are the ones we care about):
 *   ```json
 *   { "sid": 1, "action": "start", "id": 0 }
 *   ```
 * - We need to provide extra information (origin and headers), which we can get just by sending an initial empty
 *   request to the Grammarly website (https://grammarly.com). This will returns us all required cookies. Everything
 *   else could be simply represented as constant values on `./http`, since they are not changing.
 * - In a matter of fact, Grammarly supports both British and American English dialects, which could be provided as an
 *   parameter within the initialization request. The way we could request an analysis, is by sending a
 *   `RequestAnalysisMessage` with the text we want. The data returned is a bunch of JSON objects sent in separate
 *   messages, which we need to parse and merge until an object for holding the whole analysis is returned. The protocol
 *   indicates the end of an analysis after an action with the 'finished' value is received. The first message is usually:
 *   ```json
 *   { "rev": 0, "action": "submit_ot", "id": 0 }
 *   ```
 *
 * This class could be easily created without any effort by using the {@link createGrammarlyClient} function, which needs
 * asynchronous operations to be performed, since it needs to get all required cookies from the Grammarly website.
 */
export class GrammarlyClient {
    private client!: WebSocket;
    private options: GrammarlyClientOptions;

    constructor(options: GrammarlyClientOptions) {
        this.options = options;
    }

    /**
     * Establishes a connection to the Grammarly web socket server.
     * @returns A promise that resolves when the connection is established.
     */
    establish(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const authorize = Authorize.build({ cookie: this.options.cookie });
            this.client = new WebSocket(this.options.address, {
                origin: authorize.origin,
                headers: {
                    Cookie: authorize.Cookie,
                    "User-Agent": authorize["User-Agent"],
                },
            });
            this.client.once("open", () => resolve());
            this.client.once("error", (error) => reject(error));
            this.client.onerror = (error) => reject(error);
            this.client.onclose = (close) =>
                reject({ reason: close.reason, code: close.code, type: close.type } as ClosePayload);
        });
    }

    /**
     * Returns whether this client is connected to the Grammarly web socket server.
     */
    isActive(): boolean {
        return this.client !== undefined && this.client.readyState === WebSocket.OPEN;
    }

    /**
     * Closes the connection to the Grammarly web socket server.
     */
    close() {
        this.client.close();
    }

    /**
     * Sends the required initialization request to the Grammarly web socket server. This is required
     * for starting the analysis process for strings.
     * @param dialect Whether this client should use the British or American English dialect.
     */
    init(dialect: Dialect) {
        this.client.send(JSON.stringify(Initialize.build({ dialect })));
    }

    /**
     * Analyzes the given string and returns the analysis result.
     * @param content The text to be analyzed.
     * @returns A promise that resolves with the analysis result.
     */
    analyze(content: string): Promise<MergedResult> {
        return new Promise((resolve, reject) => {
            const alerts: AlertResponse[] = [];
            let emotions: EmotionsResponse;
            let finished: FinishedResponse;
            this.client.onmessage = (event: MessageEvent) => {
                const res = JSON.parse(event.data.toString()) as Response;
                switch (res.action) {
                    case "alert":
                        alerts.push(res as AlertResponse);
                        break;
                    case "emotions":
                        emotions = res as EmotionsResponse;
                        break;
                    case "finished":
                        finished = res as FinishedResponse;
                        this.client.onmessage = null;
                        this.client.onerror = null;
                        resolve({ alerts, emotions, finished });
                    default:
                        break;
                }
            };
            this.client.onerror = (error) => {
                this.client.onmessage = null;
                this.client.onerror = null;
                this.client.onclose = null;
                reject(error);
            };
            this.client.onclose = (close) => {
                this.client.onmessage = null;
                this.client.onerror = null;
                this.client.onclose = null;
                reject({ reason: close.reason, code: close.code, type: close.type } as ClosePayload);
            };
            const req = RequestAnalysis.build({ content });
            this.client.send(JSON.stringify(req));
        });
    }
}

/**
 * Creates a {@link GrammarlyClient} instance while fetching the default options from the Grammarly website.
 * @returns A promise that resolves to a {@link GrammarlyClient} instance.
 */
export default async function createGrammarlyClient() {
    return new GrammarlyClient({
        address: "wss://capi.grammarly.com/freews",
        cookie: await Request.GrabCookies(),
    });
}
