import AlertResponse from "./AlertResponse";
import EmotionsResponse from "./EmotionsResponse";
import FinishedResponse from "./FinishedResponse";

/**
 * An interface containg a batched version of all received analysis results.
 */
export default interface MergedResult {
    readonly alerts: AlertResponse[];
    readonly emotions: EmotionsResponse;
    readonly finished: FinishedResponse;
}
