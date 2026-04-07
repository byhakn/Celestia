const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Celestia backend çalışıyor" });
});

app.post("/horoscope", async (req, res) => {
  try {
    const { sign, moon, rising, type } = req.body;

    if (!sign || !type) {
      return res.status(400).json({ error: "sign ve type gerekli" });
    }

    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: "CLAUDE_API_KEY missing on server" });
    }

    const prompt = `
You are a gifted, poetic astrologer.

USER PROFILE:
- Sun sign: ${sign}
- Moon sign: ${moon || "Gemini"}
- Rising sign: ${rising || "Aquarius"}
- Horoscope type: ${type}

STYLE RULES:
- Exactly 3 short paragraphs
- Mystical but grounded
- End with one actionable insight
- Do not begin with the sign name or "Today"

Write the horoscope now.
    `.trim();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    console.log("Claude raw response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Claude API hatası",
        raw: data
      });
    }

    let text = "";

    if (Array.isArray(data?.content)) {
      text = data.content
        .map(block => block?.text || "")
        .join("")
        .trim();
    }

    if (!text) {
      return res.status(500).json({
        error: "Claude returned empty text",
        raw: data
      });
    }

    res.json({ text });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: error.message || "Sunucu hatası"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});