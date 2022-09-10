import MessageContext from "./MessageContext";

export default interface Message<T extends MessageContext, R> {
    build(ctx: T): R;
}
