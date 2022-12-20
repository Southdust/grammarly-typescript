import { jest, test, expect } from "@jest/globals";
import { GrabCookies } from "../src";
//import createGrammarlyClient from "../src/client";

jest.setTimeout(120000);

test("should return a cookie successfully", async () => {
    const cookie = await GrabCookies();
    expect(cookie).toBeDefined();
});
