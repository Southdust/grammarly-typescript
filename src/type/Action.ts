type Action =
    | "start" // Indicates that an initial request is being made.
    | "submit_ot" // Indicates that a string is being sent to analysis.
    | "option"
    | "finished" // Indicates that an analysis has finished
    | "alert" // Indicates that a grammatical error has been found within the current analysis
    | "emotions"; // Indicates that an emotion mismatch may be present within the current analysis
export default Action;
