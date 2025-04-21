import { subirPDFaDrive } from './googleSubida.js';

const carpetasPorAno = {
  "2018": "1_bNUXntK6XeR5wjmNJuncSU-0VPVKbcm",
  "2019": "17Ru-f1HSdEuqK1uEs-1QvQhEZQXVW6JK",
  "2020": "1GibEMkP04aAh30qZEJVYYHouNlRchP7l",
  "2021": "1lJKqlnIb5utWB8irAOs3oReilpMP_x0g",
  "2022": "1zeZzM4wbiHCIVuxQxTbcEUCeA9SMLXWU",
  "2023": "1IKN8xEfirFxMPgYw5_bCkncrHd9lft0C",
  "2024": "1eNHgJlBtEfoeATyR5wye89GcArW5wsLI",
  "2025": "1cQI5EWCegiUZ_LZR9ut3JmV7Fuqgsn1E",
  "2026": "1LaqYZTbOac9tIYVA6EZka_c8g177CZwc",
  "2027": "13pL-2jjeVIZAAHMJ-bhhZJIt_ilRNG7d",
  "2028": "1V6f1z21NhNkjr34q3KXILrhl-SdbyPgq",
  "2029": "162bqbBvfO25LJ-IGVO--ET4NwZAp8nQU",
  "2030": "17P199CsMYEXbi61ezvs2Y5tH1i3QiF8A"
};

export async function generarFichaDesdePlantilla(formData) {
  const PDF_TEMPLATE_URL = "/ficha_inscripcion.pdf";

  try {
    const response = await fetch(PDF_TEMPLATE_URL);
    const pdfBlob = await response.blob();

    if (!pdfBlob || pdfBlob.type !== "application/pdf") {
      throw new Error("❌ No se pudo obtener el PDF base");
    }

    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
    const form = pdfDoc.getForm();
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const mapeoTexto = {
      text_2afuq: formData.nombre_alumno,
      text_3jrhy: formData.edad,
      text_4rkrt: formData.contacto,
      text_5phrt: formData.domicilio,
      text_6vtfk: formData.genero,
      textarea_8zzra: formData.institucion,
      textarea_9ekre: formData.informacion_relevante,
      text_10tjbl: formData.nombre_apellido_apoderado,
      text_11lvps: formData.telefono_apoderado,
      text_12xvuk: formData.correo_apoderado,
      text_13atlg: formData.nombre_contacto_adicional,
      text_14ldca: formData.telefono_contacto_adicional,
      text_15yayv: formData.correo_contacto_adicional,
      text_16by: formData.taller,
    };

    for (const [campo, valor] of Object.entries(mapeoTexto)) {
      try {
        form.getTextField(campo).setText(valor || "");
      } catch {
        console.warn(`⚠️ Campo de texto '${campo}' no encontrado.`);
      }
    }

    const checkCoords = [
      { x: 40, y: 68, valor: formData.documento1 },
      { x: 230, y: 68, valor: formData.documento2 },
      { x: 425, y: 68, valor: formData.documento3 },
    ];

    checkCoords.forEach(({ x, y, valor }) => {
      if (valor) {
        page.drawText("X", {
          x,
          y,
          size: 14,
          font,
          color: rgb(0, 0, 0),
        });
      }
    });

    console.log("📦 Campos PDF disponibles:", form.getFields().map(f => f.getName()));

    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const finalBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const nombre_alumno = `Ficha - ${formData.nombre_alumno} - ${formData.taller}`;


    const ano = formData.ano_taller?.toString();
    const folderId = carpetasPorAno[ano] || import.meta.env.VITE_FOLDER_ID;

    const result = await subirPDFaDrive(finalBlob, nombre_alumno, folderId);

    console.log("✅ Documento subido a Drive:", result);

    return `https://drive.google.com/file/d/${result.id}/view`;

  } catch (error) {
    console.error("❌ Error generando ficha desde PDF:", error.message, error.stack, error);
    throw error;
  }
}
