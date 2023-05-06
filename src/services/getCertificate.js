import PDFDocument from "@react-pdf/pdfkit";
import { toDataURL } from "qrcode";
import { isEmpty, isAlpha } from "validator";
import { encode } from 'js-base64';
import PETLogo from "../assets/logoPET.png"

//http://localhost:5000/prv-pets/getCertificado

const validarParametros = async (body) => {
  if ( isEmpty("" + body["pessoa-certificada"]) || !isAlpha( ("" + body["pessoa-certificada"]).replace(/ /g, ""), "pt-BR" ) ) return { Accept: false, Cause: "Nome da pessoa certificada inválido" };
  if ( isEmpty("" + body["nome-curso"]) || !isAlpha(("" + body["nome-curso"]).replace(/ /g, ""), "pt-BR") ) return { Accept: false, Cause: "Nome do curso inválido" };
  if (!["conclusao", "participacao"].includes(body["tipo-certificado"])) return { Accept: false, Cause: "Tipo de certificado inválido, dispoíveis: 'conclusao' e 'participacao'" };
  if (!Array.isArray(body["responsaveis-atividade"])) return { Accept: false, Cause: "O campo 'responsaveis-atividade' deve ser um array" };
  if (body["responsaveis-atividade"].length < 1) return { Accept: false, Cause: "O campo 'responsaveis-atividade' deve conter ao menos um nome" };

  for (const resp of body["responsaveis-atividade"]) {
    if ( isEmpty("" + resp) || !isAlpha(("" + resp).replace(/ /g, ""), "pt-BR")) return { Accept: false, Cause: "O campo 'responsaveis-atividade' tem algum nome inválido" };
  }
  
  if ( isEmpty("" + body["assinatura"]) || !isAlpha(("" + body["assinatura"]).replace(/ /g, ""), "pt-BR", { ignore: "."})) return { Accept: false, Cause: "Nome da assinatura inválido" };
  if (isEmpty("" + body["cargo-assinatura"])) return { Accept: false, Cause: "Cargo da assinatura inválido" };
  return { Accept: true, Cause: "Tudo Ok" };
};

const generatePDF = async (req) => {
  try {
    const body = {
      "pessoa-certificada": req.pessoa_certificada,
      "nome-curso": req.nome_curso,
      "tipo-certificado": req.tipo_certificado,
      "responsaveis-atividade": req.responsaveis_atividade,
      "cidade-e-data": req.cidade_e_data,
      assinatura: req.nome_assinante,
      "cargo-assinatura": req.cargo_assinatura
    };

    const link_qr = "https://www.google.com.br";

    const veredito = await validarParametros(body);
    if (!veredito["Accept"]) {
      throw new Error(veredito.Cause);
    }

    const tipoCerticado = body["tipo-certificado"];
    if(tipoCerticado === "conclusao") body["tipo-certificado"] = ", concluiu com exito o(a) ";
    else if(tipoCerticado === "participacao") body["tipo-certificado"] = ", participou do(a) ";


    //Daqui para baixo é onde desenha o PDF
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      bufferPages: true
    });
    
    const distanceMargin = 18;
    
    const grad = doc.linearGradient(0, 0, 0, 100);
    grad.stop(0, "#31FFEF");
    grad.stop(1, "#8CA5FF");
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");
    doc
    .fillAndStroke(grad)
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();
      
    const maxWidth = 280;
    const maxHeight = 140;

    doc.image(
      PETLogo,
      doc.page.width / 2 - maxWidth / 2,
      60,
      {
        fit: [maxWidth, maxHeight],
        align: "center"
      }
    );
        
    const jumpLine = (doc, lines) => { for(let index = 0; index < lines; index++) { doc.moveDown(); } }
    
    jumpLine(doc, 11);
    
    doc
    .font("Helvetica")
    .fontSize(28)
    .fill("#021c27")
    .font("Times-BoldItalic")
    .text("Certificado de Conclusão", { align: "center"});
      
    jumpLine(doc, 1);
      
      
    doc
    .fontSize(18)
    .fill("#021c27")
    .font("Helvetica")
    .text("Certificamos que ", { continued: true, align: "justify" })
    .font("Helvetica-Bold")
    .text(body["pessoa-certificada"], { continued: true, align: "justify" })
    .font("Helvetica")
    .text(body["tipo-certificado"], { continued: true, align: "justify" })
    .font("Helvetica-Bold")
    .text(body["nome-curso"], { continued: true, align: "justify" })
    .font("Helvetica")
    .text(".", { align: "justify" });

    doc
    .fontSize(12)
    .moveDown(0.2)
    .fill("#021c27")
    .font("Helvetica")
    .text("Ministrado por ", {
      continued: true,
      align: "justify",
      indent: 28
    });

    const add_ministrantes = (doc, ministrantes) => {
      ministrantes.forEach((element, index) => {
        doc
        .font("Helvetica-Bold")
        .text(element, { continued: true, align: "justify" });

        if((ministrantes.length - index) === 2) doc.font("Helvetica").text(" e ", { continued: true, align: "justify" });
        else if((ministrantes.length - index) > 2) doc.font("Helvetica").text(", ", { continued: true, align: "justify" });
      })

      doc.font("Helvetica").text(".", { align: "justify" });
    }

    add_ministrantes(doc, body["responsaveis-atividade"]);

    let oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      "Carga horária: 30 horas",
      doc.x,
      doc.page.height - oldBottomMargin, { align: "center" }
      )
      .moveDown(0.5)
      .fill("#021c27")
    .font("Times-BoldItalic")
    .text(body["cidade-e-data"], {
      align: "center"
    });
    
    
    // Signatures
    doc.lineWidth(1);
    const lineSize = 174;
    const signatureHeight = doc.page.height - oldBottomMargin - 50;
    
    doc.fillAndStroke("#021c27");
    doc.strokeOpacity(0.2);
    

    const endLine1 = 128 + lineSize;
    const startLine2 = endLine1 + 32;
    const endLine2 = startLine2 + lineSize;
    
    doc
    .moveTo(startLine2, signatureHeight)
    .lineTo(endLine2, signatureHeight)
    .stroke();

    doc
    .font("Helvetica")
    .fontSize(10)
    .fill("#021c27")
    .text(body["assinatura"], startLine2, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center"
    }
    );


    const tamanhoQR = 70;

    doc.image(
      PETLogo,
      doc.page.width - tamanhoQR - distanceMargin * 2,
      doc.page.height - tamanhoQR - distanceMargin * 2,
      {
        fit: [tamanhoQR, tamanhoQR],
        align: "center"
      }
    );
    

    toDataURL(link_qr, (err, src) => {
      if (err) throw new Error("Erro ao gerar o QrCode");
      doc.image(
        src,
        distanceMargin * 2,
        doc.page.height - tamanhoQR - distanceMargin * 2,
        {
          fit: [tamanhoQR, tamanhoQR],
          align: "center"
        }
      );

      doc.end();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default generatePDF;
