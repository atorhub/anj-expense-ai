async function analyzeSMS(text) {
    const response = await fetch("https://api.groq.com/v1/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "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"
        },
        body: JSON.stringify({ message: text })
    });

    const result = await response.json();
    console.log(result);

    const dashboard = document.querySelector("#dashboard");
    dashboard.innerHTML += `<div>${JSON.stringify(result)}</div><hr>`;

}

async function analyzeBulk() {
    const input = document.getElementById("smsInput").value;
    const messages = input.split("\n");

    let results = [];
    for (let msg of messages) {
        await analyzeSMS(msg);
    }
}
