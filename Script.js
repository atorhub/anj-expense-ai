// ---------------- MAIN HANDLER ----------------
async function handleFiles() {
  const files = document.getElementById("fileInput").files;
  if (!files.length) {
    alert("Please upload files");
    return;
  }

  document.getElementById("status").innerText = "Parsing… please wait";

  let finalOutput = "";

  for (let file of files) {
    const name = file.name.toLowerCase();

    if (name.endsWith(".zip")) {
      finalOutput += await parseZip(file);
    } 
    else if (name.endsWith(".pdf")) {
      finalOutput += await parsePDF(file);
    }
    else if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")) {
      finalOutput += await parseImage(file);
    }
    else {
      finalOutput += `\n❌ Unsupported file: ${file.name}\n`;
    }
  }

  document.getElementById("output").innerText = finalOutput;
  localStorage.setItem("anj_expense_text", finalOutput);

  document.getElementById("status").innerText = "✔ Done";
}


// ---------------- ZIP PARSER ----------------
async function parseZip(file) {
  const zip = await JSZip.loadAsync(file);
  let text = `\n📦 ZIP: ${file.name}\n`;

  for (const filename of Object.keys(zip.files)) {
    const entry = zip.files[filename];

    if (filename.endsWith(".txt")) {
      const content = await entry.async("string");
      text += `\n📄 ${filename}\n${content}\n`;
    }
  }
  return text;
}


// ---------------- PDF PARSER ----------------
async function parsePDF(file) {
  let arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = `\n📘 PDF: ${file.name}\n`;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(i => i.str).join(" ");
    text += `\n--- Page ${i} ---\n${pageText}\n`;
  }

  return text;
}


// ---------------- IMAGE PARSER (OCR) ----------------
async function parseImage(file) {
  const { data: { text }} = await Tesseract.recognize(file, "eng");
  return `\n🖼️ IMAGE: ${file.name}\n${text}\n`;
}
}
