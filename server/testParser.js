import fs from "fs";
import { parseResume } from "./utils/resumeParser.js";

async function test() {
  try {
    const buffer = fs.readFileSync("../sample-resume.pdf");
    const text = await parseResume(buffer);
    console.log("--- SUCCESS ---");
    console.log("Parsed PDF Content:");
    console.log(JSON.stringify(text));
  } catch (err) {
    console.error("--- FAILED ---");
    console.error(err);
  }
}

test();
