import { Action } from "../type";
import Response from "./Response";

/**
 * A collection of emotion analysis sent by Grammarly.
 */
export default interface EmotionsResponse extends Response {
    readonly emotions: Emotion[];
    readonly hidden: boolean;
    readonly rev: number;
    readonly action: Action;
}

// todo
export interface Emotion {}
