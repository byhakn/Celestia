const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const HOROSCOPES = {
  aries: "Today rewards bold beginnings. A direct conversation clears confusion, and quick action on a delayed task restores momentum. Protect your energy from scattered distractions and focus on one decisive move.",
  taurus: "Steady progress matters more than speed today. Small practical actions bring visible results, especially around money, comfort, and routine. Choose consistency over impulse and let patience work in your favor.",
  gemini: "Your mind is especially active today, and the right conversation can open an unexpected door. Stay curious, but do not overcommit. One clear message will do more than ten rushed ones.",
  cancer: "Emotional clarity arrives when you stop carrying what is not yours. Home, family, and personal comfort need your attention today. A gentle boundary creates more peace than silent frustration.",
  leo: "Confidence grows when you act instead of waiting for validation. Your presence is magnetic today, especially in social or creative settings. Lead warmly, but leave room for others to shine beside you.",
  virgo: "Order returns when you simplify. Focus on one practical improvement instead of trying to fix everything at once. A thoughtful decision around work or health brings quiet but lasting relief.",
  libra: "Balance comes from honesty, not avoidance. A relationship or partnership matter becomes easier once spoken clearly. Choose what feels fair and sustainable rather than what keeps everyone temporarily comfortable.",
  scorpio: "Your instincts are strong today, especially around trust and timing. Keep your plans close until they are ready. A focused effort behind the scenes gives you more power than a dramatic reveal.",
  sagittarius: "Movement helps you think clearly today. A new idea, trip, or perspective lifts your energy, but grounding it in action is the key. Say yes to growth, but give it structure.",
  capricorn: "Responsibility is high, but so is your ability to handle it well. Progress comes through discipline, not pressure. Finish one important task fully before taking on something new.",
  aquarius: "A different approach solves what repetition could not. Innovation, friendship, and future planning are favored today. Trust your originality, but communicate it in a way others can actually follow.",
  pisces: "Your sensitivity is useful today when paired with clear boundaries. Rest, reflection, and creative thought bring insight. Do not confuse delay with failure; some things improve when given space."
};

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Celestia backend çalışıyor" });
});

app.post("/horoscope", (req, res) => {
  try {
    const { sign } = req.body;

    if (!sign) {
      return res.status(400).json({ error: "sign gerekli" });
    }

    const key = String(sign).toLowerCase().trim();
    const text = HOROSCOPES[key];

    if (!text) {
      return res.status(400).json({ error: "geçersiz burç" });
    }

    return res.json({ text });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Sunucu hatası" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});