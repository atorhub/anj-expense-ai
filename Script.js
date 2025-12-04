async function analyzeSMS(text) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "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"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: "You are a financial SMS parser. Return JSON only." },
          { role: "user", content: text }
        ],
        temperature: 0
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const result = await response.json();
    console.log("AI raw result:", result);

    const content = result.choices?.[0]?.message?.content?.trim();
    const dashboard = document.querySelector("#dashboard");
    dashboard.innerHTML += `<div>📩 ${text}<br>🧠 ${content}</div><hr>`;
  } catch (err) {
    console.error("AI error:", err);
    const dashboard = document.querySelector("#dashboard");
    dashboard.innerHTML += `<div>❌ Error analyzing "${text}": ${err.message}</div><hr>`;
  }
}

