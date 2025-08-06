import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import "dotenv/config";

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        shield({ mode:"LIVE" }),
        detectBot({ mode:"LIVE", allow:["SEARCH_ENGINE"]}),
        tokenBucket({ mode:"LIVE", refillRate:30, interval:5, capacity:20 })
    ]

})