import { Action } from "../type";

/**
 * An interface containing common fields between all response messages.
 */
export default interface Response {
    readonly action: Action;
}
