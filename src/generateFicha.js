import { subirPDFaDrive } from './googleSubida.js';

const carpetasPorAno = {
  "2024": "1zaC8DJIY-1Z0aaKJsjO91kWd9iyVkKd1",
  "2025": "1UBOINmiojINd6SHpEBiyPuUp2SGbQ_s7",
  "2026": "1vlFMfwnYe295xpBOhOGCScTVGf-XE0EW",
  "2027": "1lMr9uA3Cn8fIiwFp1ZoCi1nVJgq79whU",
  "2028": "1Z18wrltAd3f63MoFui1NnyoKCOudPkNM",
  "2029": "1XHgZFza3-bLDPwRRp8etNX4J0SXvlhjs",
  "2030": "1PCF3Js0oH5ehKvJl_ORuyZUq4pKnf7LV"
};

export async function generarFichaDesdePlantilla(formData) {
  const PDF_TEMPLATE_URL = "/FichaTalleresMujerInf.pdf";        // con línea de firma (para imprimir)
  const PDF_TEMPLATE_URL_TO_SEND = "/FichaTalleresMujerInfBlanco.pdf"; // sin línea de firma (para Drive)

  try {
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const fontConfig = async (pdfDoc) => await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Función para cargar y rellenar cualquier plantilla
    const rellenarPlantilla = async (url, data) => {
      const response = await fetch(url);
      const pdfBlob = await response.blob();
      if (!pdfBlob || pdfBlob.type !== "application/pdf") throw new Error(`❌ No se pudo cargar: ${url}`);

      const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
      const form = pdfDoc.getForm();
      const page = pdfDoc.getPages()[0];
      const font = await fontConfig(pdfDoc);

      const mapeoTexto = {
        text_nombre_taller: data.text_nombre_taller,
        text_monitor: data.text_monitor,
        text_dia: data.text_dia,
        text_horario: data.text_horario,
        text_nombre_completo: data.text_nombres + " " + data.text_apellidos,
        text_nombres: data.text_nombres,
        text_apellidos: data.text_apellidos,
        text_cedula: data.text_cedula,
        text_nacionalidad: data.text_nacionalidad,
        text_fecha_nacimiento: data.text_fecha_nacimiento,
        text_escolaridad: data.text_escolaridad,
        text_estado_civil: data.text_estado_civil,
        text_domicilio: data.text_domicilio,
        text_telefono: data.text_telefono,
        text_enfermedades: data.text_enfermedades || "No",
        text_discapacidad: data.text_discapacidad || "No",
        text_derivacion: data.text_derivacion || "No",
        text_otros_talleres: data.text_otros_talleres,
        text_semestre: data.text_semestre,
        text_20sknx: data.text_20sknx.toString() || "2025"
      };

      for (const [campo, valor] of Object.entries(mapeoTexto)) {
        try {
          form.getTextField(campo).setText(valor || "");
        } catch {
          console.warn(`⚠️ Campo '${campo}' no encontrado en el PDF.`);
        }
      }

      // Checkboxes manuales
      const checkboxes = [
        { x: 170, y: 113, valor: data.checkbox_19bqbu },
        { x: 170, y: 95, valor: data.checkbox_20ddbp },
        { x: 30, y: 160, valor: data.checkbox_21ybso }
      ];

      checkboxes.forEach(({ x, y, valor }) => {
        if (valor) {
          page.drawText("X", { x, y, size: 14, font, color: rgb(0, 0, 0) });
        }
      });

      form.flatten();
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: "application/pdf" });
    };

    // 1) Generar el PDF para imprimir (con línea de firma)
    const pdfImprimible = await rellenarPlantilla(PDF_TEMPLATE_URL, formData);
    const urlImprimible = URL.createObjectURL(pdfImprimible);
    window.open(urlImprimible, "_blank"); // abrir en nueva pestaña

    // 2) Generar el PDF para enviar (sin línea de firma)
    const pdfParaEnviar = await rellenarPlantilla(PDF_TEMPLATE_URL_TO_SEND, formData);

    // Subir a Drive
    const nombreCompleto = `${formData.text_nombres} ${formData.text_apellidos}`;
    const nombreArchivo = `Ficha - ${nombreCompleto} - ${formData.text_nombre_taller}`;
    const folderId = carpetasPorAno[formData.text_20sknx] || import.meta.env.VITE_FOLDER_ID;
    const result = await subirPDFaDrive(pdfParaEnviar, nombreArchivo, folderId);

    console.log("✅ Documento subido a Drive:", result);
    return `https://drive.google.com/file/d/${result.id}/view`;

  } catch (error) {
    console.error("❌ Error generando ficha:", error.message, error.stack, error);
    throw error;
  }
}
