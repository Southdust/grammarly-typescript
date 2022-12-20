import createGrammarlyClient from "grammarly.js";

async function start() {
    console.log("starting");
    const client = await createGrammarlyClient();
    await client.establish();
    client.init("american");
    const str = "helo world";
    const analysis = await client.analyze(str);
    console.log(analysis);
}

start().catch((error) => console.log("Failed:", error));
