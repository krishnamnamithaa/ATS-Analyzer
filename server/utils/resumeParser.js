import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parseResume(fileBuffer) {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Received empty buffer");
    }

    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(
      fileBuffer.buffer,
      fileBuffer.byteOffset,
      fileBuffer.byteLength
    );

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true
    });

    const pdf = await loadingTask.promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }

    return text.trim();
  } catch (error) {
    console.error("PDF Parsing error:", error);
    throw error;
  }
}
