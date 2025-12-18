// captcha.js — client-side CAPTCHA generator (intentionally insecure demo)
(() => {
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");
  const refreshBtn = document.getElementById("refreshBtn");
  const verifyBtn = document.getElementById("verifyBtn");
  const input = document.getElementById("captchaInput");
  const result = document.getElementById("result");

  let currentCaptcha = "";

  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function randomText(len = 3) {
    let s = "";
    for (let i = 0; i < len; i++) s += ALPHABET[randInt(0, ALPHABET.length - 1)];
    return s;
  }

  function drawNoise() {
    for (let i = 0; i < 130; i++) {
      ctx.fillStyle = `rgba(${randInt(120,255)},${randInt(120,255)},${randInt(120,255)},${Math.random() * 0.35})`;
      ctx.beginPath();
      ctx.arc(randInt(0, canvas.width), randInt(0, canvas.height), Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${randInt(80,220)},${randInt(80,220)},${randInt(80,220)},${Math.random() * 0.5})`;
      ctx.lineWidth = randInt(1, 2);
      ctx.beginPath();
      ctx.moveTo(randInt(0, 40), randInt(0, canvas.height));
      ctx.bezierCurveTo(
        randInt(40, 120), randInt(0, canvas.height),
        randInt(100, 180), randInt(0, canvas.height),
        randInt(160, canvas.width), randInt(0, canvas.height)
      );
      ctx.stroke();
    }
  }

  function renderCaptcha(text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#0f1a33");
    grad.addColorStop(1, "#0b1326");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawNoise();
    const baseX = 18;
    const y = 46;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const x = baseX + i * 38 + randInt(-2, 2);
      const angle = (randInt(-18, 18) * Math.PI) / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.font = `${randInt(28, 34)}px Arial`;
      ctx.fillStyle = `rgba(230, 240, 255, 0.95)`;
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 3;
      ctx.fillText(ch, 0, 0);

      ctx.restore();
    }
  }

  function newCaptcha() {
    currentCaptcha = randomText(5);
    renderCaptcha(currentCaptcha);
    input.value = "";
    result.textContent = "";
  }

  function verify() {
    const guess = (input.value || "").trim().toUpperCase();
    if (!guess) {
      result.textContent = "Type the CAPTCHA first.";
      return;
    }
    if (guess === currentCaptcha) {
      result.textContent = "✅ Verified (client-side).";
    } else {
      result.textContent = "❌ Wrong. New CAPTCHA generated.";
      newCaptcha();
    }
  }

  refreshBtn.addEventListener("click", newCaptcha);
  verifyBtn.addEventListener("click", verify);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") verify();
  });

  newCaptcha();
})();

