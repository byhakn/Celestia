const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Celestia backend çalışıyor" });
});

app.post("/horoscope", async (req, res) => {
  try {
    const { sign } = req.body;

    if (!sign) {
      return res.status(400).json({ error: "sign gerekli" });
    }

    const url = `https://aztro.sameerkumar.website/?sign=${encodeURIComponent(
      sign.toLowerCase()
    )}&day=today`;

    const response = await fetch(url, {
      method: "POST"
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || "Aztro API hatası"
      });
    }

    return res.json({
      text: data.description || "Bugün için yorum bulunamadı."
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Sunucu hatası"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});