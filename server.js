import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

// Serve the frontend files from /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * POST /api/ai/points
 * Frontend sends task info -> backend calls OpenAI -> returns points suggestion
 */
app.post("/api/ai/points", async (req, res) => {
  try {
    const { name, frequencyUnit, timesPerFrequency, category, estimatedMinutes } = req.body;

    const prompt = `
Return ONLY JSON: {"points": number, "reason": "short reason"}.
Task:
- name: ${name}
- frequency: ${frequencyUnit}
- target: ${timesPerFrequency} per period
- category: ${category || "none"}
- estimated minutes: ${estimatedMinutes || "unknown"}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      response_format: { type: "json_object" }
    });

    const json = JSON.parse(response.output[0].content[0].text);
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI points failed" });
  }
});

/**
 * POST /api/ai/encouragement
 * Frontend sends a progress snapshot -> backend asks OpenAI -> returns message
 */
app.post("/api/ai/encouragement", async (req, res) => {
  try {
    const { progressSnapshot } = req.body;

    const prompt = `
You are kind and practical.
Here is the user's progress (JSON):
${JSON.stringify(progressSnapshot, null, 2)}
Write 2-4 sentences encouragement. No guilt.
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    res.json({ message: response.output_text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI encouragement failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Running on http://localhost:3000");
});
