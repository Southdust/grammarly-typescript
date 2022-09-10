import createGrammarlyClient from "grammarly.js";

async function start() {
    console.log("starting");
    const client = await createGrammarlyClient();
    await client.establish();
    client.init("american");

    client.on("result", (data) => console.warn(data));
    client.on("error", (data) => console.error("error", data));
    client.on("close", (data) => console.log("close", data));

    const str = "helo world";
    const analysis = await client.analyze(str);
}

start();
