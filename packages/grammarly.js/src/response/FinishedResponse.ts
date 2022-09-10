import { Action, Dialect } from "../type";
import Response from "./Response";

/**
 * A response used by Grammarly to indicate that the analysis is finished.
 */
export default interface FinishedResponse extends Response {
    readonly action: Action;
    readonly sid: number;
    readonly rev: number;
    readonly score: number;
    readonly generalScore: number;
    readonly scoresStatus: string;
    readonly removed: any[];
    readonly dialect: Dialect;
    readonly foreign: boolean;
    readonly checksStatus: string;
    readonly interrupts?: number;
    readonly skipped?: number;
    readonly rejected?: number;
    readonly blocked?: number;
    readonly checkedBegin?: number;
    readonly checkedEnd?: number;
}
