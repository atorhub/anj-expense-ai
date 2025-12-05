async function analyzeSMS(text) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: "You are a financial SMS parser. Return JSON only." },
          { role: "user", content: `Parse this: "${text}". Return JSON with amount, type, category, description.` }
        ],
        temperature: 0
      })
    });

    const dashboard = document.querySelector("#dashboard");

    if (!response.ok) {
      const errText = await response.text();
      dashboard.innerHTML += `<div>❌ HTTP ${response.status}: ${errText}</div><hr>`;
      console.error("HTTP error:", response.status, errText);
      return;
    }

    const result = await response.json();
    console.log("AI result:", result);

    const content = result.choices?.[0]?.message?.content?.trim();
    dashboard.innerHTML += `<div>📩 ${text}<br>🧠 ${content}</div><hr>`;
  } catch (err) {
    console.error("AI error:", err);
    document.querySelector("#dashboard").innerHTML += `<div>❌ JS error: ${err.message}</div><hr>`;
  }
}
