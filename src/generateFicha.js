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
  const PDF_TEMPLATE_URL = "/FORMATO_FICHA_INSCRIPCION_TALLERES_CULTURA.pdf";

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

    const direccionCompleta = `${formData.domicilio}, ${formData.calle}, #${formData.numero_casa}`;

    const mapeoTexto = {
      text_2harj: formData.nombre_alumno,
      text_3tqxg: formData.edad,
      text_4awf: formData.correo_alumno,
      text_5rtqv: formData.contacto,
      text_6bmpx: formData.genero,
      text_7dbe: formData.nacionalidad,
      text_8evuz: formData.rut,
      text_9dbxg: direccionCompleta,
      text_10oep: formData.taller,
      text_11iwgj: formData.ano_taller,
      text_12wiqa: formData.nombre_alumno,
      text_13thsd: formData.informacion_relevante,
      text_14aaor: formData.nombre_apellido_apoderado,
      text_15kxhq: formData.telefono_apoderado,
      text_16kfpy: formData.correo_apoderado,
      text_17jlee: formData.nombre_contacto_adicional,
      text_18qxwj: formData.telefono_contacto_adicional,
      text_20ejj: formData.correo_contacto_adicional
    };

    for (const [campo, valor] of Object.entries(mapeoTexto)) {
      try {
        form.getTextField(campo).setText(valor || "");
      } catch {
        console.warn(`⚠️ Campo '${campo}' no encontrado.`);
      }
    }

    // Coordenadas para las X en los checkboxes
    const checkCoords = [
      { x: 25, y: 122, valor: formData.documento1 },
      { x: 230, y: 122, valor: formData.documento2 },
      { x: 420, y: 122, valor: formData.documento3 },
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

    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const finalBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const nombreArchivo = `Ficha - ${formData.nombre_alumno} - ${formData.taller}`;
    const folderId = carpetasPorAno[formData.ano_taller] || import.meta.env.VITE_FOLDER_ID;

    const result = await subirPDFaDrive(finalBlob, nombreArchivo, folderId);
    console.log("✅ Documento subido a Drive:", result);

    return `https://drive.google.com/file/d/${result.id}/view`;

  } catch (error) {
    console.error("❌ Error generando ficha desde PDF:", error.message, error.stack, error);
    throw error;
  }
}
