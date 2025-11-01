import dotenv from "dotenv";
dotenv.config();

// Minimal ask controller — returns a JSON { answer } so frontend won't get 404.
// Extend this to call OpenAI or your model and return the model response.

export const ask = async (req, res) => {
  try {
    const { question, mode } = req.body || {};

    // Basic validation
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    // If no API key, fall back to the simple echo so the app still works
    if (!OPENAI_KEY) {
      console.warn("OPENAI_API_KEY not set — returning echo fallback");
      return res.status(200).json({ answer: `Echo (${mode || "patient"}): ${question}` });
    }

    // Build prompt/messages for Chat Completions
    const systemPrompt = mode === "doctor"
      ? "You are Cura AI, a helpful assistant for healthcare professionals. Be concise and clinical."
      : "You are Cura AI, a friendly healthcare assistant for patients. Provide clear general guidance and encourage consulting professionals.";

    // Use global fetch (Node 18+). If using older Node, install node-fetch and import it.
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 600
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error("OpenAI responded with error:", resp.status, text);
      return res.status(502).json({ message: "Model service error", detail: text });
    }

    const data = await resp.json().catch(() => ({}));
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      // fallback to echo if model didn't return text
      return res.status(200).json({ answer: `Echo (${mode || "patient"}): ${question}` });
    }

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Ask handler error:", err);
    return res.status(500).json({ message: "Server error handling ask request" });
  }
};
