import jsPDF from "jspdf";
import sinTitulo2 from "./assets/logos/logosanfer2.png";
import sinTitulo from "./assets/logos/escudo.png";

export const generarPDF = (formData) => {
  const doc = new jsPDF();
  let y = 20; // Posición inicial Y

  // Agregar imágenes en las esquinas
  const imgWidth = 20, imgHeight = 20;
  doc.addImage(sinTitulo, "PNG", 10, y, imgWidth, imgHeight);
  doc.addImage(sinTitulo2, "PNG", 170, y, imgWidth, imgHeight);
  y += imgHeight + 10; // Ajuste de posición después de las imágenes

  const addJustifiedText = (doc, text, x, y, maxWidth) => {
    let splitText = doc.splitTextToSize(text, maxWidth); // Divide el texto en líneas
    splitText.forEach((line, index) => {
      let words = line.split(" ");
      let totalWordWidth = words.reduce((acc, word) => acc + doc.getTextWidth(word), 0);
      let spaceWidth = (maxWidth - totalWordWidth) / (words.length - 1 || 1); // Espaciado entre palabras
      let currentX = x;
  
      words.forEach((word, i) => {
        doc.text(word, currentX, y + index * 6); // Imprime la palabra en su posición
        currentX += doc.getTextWidth(word) + spaceWidth; // Mueve la posición X
      });
    });
    return splitText.length * 6; // Retorna la altura utilizada
  };
  
  

  // Encabezado
  doc.setFontSize(18);
  doc.text("Declaración de Solicitud de Análisis y Datos", 105, y, { align: "center" });
  y += 15;

  doc.setFontSize(10);
  let texto = `Yo, ${formData.hola}, identificado con el cargo de ${formData.cargo}, del departamento ${formData.area}, bajo la dirección de ${formData.encargadoArea}, solicito formalmente el servicio de datos descrito a continuación:`;
  let splitText = doc.splitTextToSize(texto, 170);
  doc.text(splitText, 20, y,{maxWidth: 170, align: "justify"});
  y += splitText.length * 5;


  
  // Tipo de solicitud
  if (formData.informe) {
    doc.text("Tipo de Solicitud:", 20, y);
    y += 5;
    let informeText = doc.splitTextToSize(formData.informe, 170);
    doc.text(informeText, 20, y);
    y += informeText.length * 10;
  }

  // Datos solicitados
  if (formData.peticion) {
    doc.text("Datos Solicitados (en caso de conocerlos):", 20, y);
    y += 5;
    let peticionText = doc.splitTextToSize(formData.peticion, 170);
    doc.text(peticionText, 20, y);
    y += peticionText.length * 10;
  }

  // Finalidad de la solicitud
  if (formData.finalidad) {
    doc.text("Finalidad de la Solicitud:", 20, y);
    y += 5;
    let finalidadText = doc.splitTextToSize(formData.finalidad, 170);
    doc.text(finalidadText, 20, y);
    y += finalidadText.length * 10;
  }

  // Texto legal
  let textoLegal = `Esta declaración se realiza en cumplimiento del Artículo 9 de la Ley N° 19.628 sobre la Protección de la Vida Privada, el cual estipula que los datos personales sólo podrán ser tratados para los fines específicos indicados en el momento de su recolección. Asimismo, se establece que la Unidad de Ciencia de Datos queda exenta de cualquier responsabilidad por la malversación o uso indebido de los datos o información proporcionada, siendo dicha responsabilidad exclusiva del área solicitante y del usuario que realice el tratamiento o utilice la información fuera de los fines declarados.`;
  let splitTextoLegal = doc.splitTextToSize(textoLegal, 170);
  doc.text(splitTextoLegal, 20, y,{maxWidth: 170, align: "justify"});
  y += splitTextoLegal.length * 5;

  // Descripción del informe (si aplica)
  if (formData.informe === "Informe" || formData.informe === "Ambos") {
    doc.text("Descripción del Informe:", 20, y);
    y += 5;
    let descripcionInforme = doc.splitTextToSize(formData.descripcionInforme, 170);
    doc.text(descripcionInforme, 20, y);
    y += descripcionInforme.length * 10;
  }

  // Compromisos
  doc.text("Declaro que:", 20, y);
  y += 5;
  const compromisos = [
    "1. Toda la información proporcionada en esta solicitud es veraz y corresponde a las necesidades del área solicitante.",
    "2. La finalidad para la cual se requieren los datos cumple con lo estipulado en la Ley N° 20.575 sobre la protección de datos personales y el Artículo 9 de la Ley N° 19.628.",
    "3. Me comprometo a respetar los protocolos definidos por la Unidad de Ciencia de Datos para la transferencia y uso de la información proporcionada.",
    "4. Acepto que cualquier incumplimiento en el uso de la información derivada de esta solicitud será responsabilidad del área solicitante."
  ];
  compromisos.forEach((compromiso) => {
    let compromisoText = doc.splitTextToSize(compromiso, 170);
    doc.text(compromisoText, 20, y,{maxWidth: 170, align: "justify"});
    y += compromisoText.length * 5;
  });

  // Firmas
  y += 10;
  doc.text("_____________________________________", 20, y);
  doc.text("Firma del Director del Área Solicitante", 25, y + 10);
  doc.text("_____________________________________", 120, y);
  doc.text("Firma de Jurídico", 145, y + 10);

  // Convertir PDF a Blob
  const pdfBlob = doc.output("blob");

  // Crear una URL para el Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Abrir nueva ventana con el visor del PDF
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Previsualización de PDF</title>
          <style>
            body { 
              margin: 0; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              background-color: #f5f5f5;
            }
            iframe { 
              width: 90%; 
              height: 100vh; 
              border: none; 
            }
            button {
              padding: 20px 40px; 
              margin: 10px; 
              background-color: green; 
              color: white; 
              border: none; 
              cursor: pointer;
              font-size: 16px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <iframe src="${pdfUrl}" style="zoom:3.5;"></iframe>
          <button id="downloadBtn">Descargar y enviar PDF</button>
        </body>
      </html>
    `);

    // Esperar a que la ventana cargue y luego añadir evento al botón
    newWindow.document.addEventListener("DOMContentLoaded", () => {
      newWindow.document.getElementById("downloadBtn").addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "Declaracion_Solicitud_Analisis_Datos.pdf";
        a.click();
      });
    });
  } else {
    alert("¡Tu navegador bloqueó la apertura de ventanas emergentes! Permítelo para ver la previsualización.");
  }
};
