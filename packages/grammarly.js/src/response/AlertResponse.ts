import { Action } from "../type";
import Response from "./Response";

/**
 * The most common response from the Grammarly web socket server. This represents an in-depth analysis for a gramatical error.
 */
export default interface AlertResponse extends Response {
    readonly category: string;
    readonly id: number;
    readonly pid: number;
    readonly rid: number;
    readonly sid: number;
    readonly action: Action;
    readonly point?: string;
    readonly title?: string;
    readonly minicardTitle?: string;
    readonly begin: number;
    readonly end: number;
    readonly text: string;
    readonly group: string;
    readonly pname: string;
    readonly rev: number;
    readonly highlightBegin: number;
    readonly highlightEnd: number;
    readonly highlightText: string;
    readonly replacements: any[];
    readonly transformJson: TransformJson;
    readonly impact: string;
    readonly extra_properties: object;
    readonly cardLayout: CardLayout;
    readonly categoryHuman: string;
    readonly cost: number;
    /**
     * HTML transformations to be applied to the text.
     */
    readonly transforms?: string[];
    /**
     * HTML explanation for the error.
     */
    readonly explanation?: string;
    /**
     * HTML examples of correct and incorrect usages.
     */
    readonly examples?: string;
    readonly todo?: string;
    readonly free?: boolean;
    readonly sentence_no?: string;
    readonly inline?: string;
}

export interface Transform {
    readonly s: number;
    readonly e: number;
}

export interface TransformJson {
    readonly context: Transform;
    readonly highlights: Transform[];
    readonly alternatives: any[];
}

export interface CardLayout {
    readonly category: string;
    readonly group: string;
    readonly groupDescription: string;
    readonly rank: number;
    readonly outcome: string;
    readonly outcomeDescription: string;
    readonly outcomeRank: number;
    readonly bundle?: string;
    readonly bundleRank?: number;
    readonly promoFeature?: string;
}
