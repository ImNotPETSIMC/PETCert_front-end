import PDFDocument from "pdfkit";
import { toDataURL } from "qrcode";
import { isEmpty, isAlpha } from "validator";
import { Base64Encode } from "base64-stream";

//http://localhost:5000/prv-pets/getCertificado

const checkEmpty = (target) => { return isEmpty("" + target); };
const checkAlpha = (target) => { return isAlpha(("" + target.replace(/ /g, ""), "pt-BR")); };

const validarParametros = async (body) => {
  if ( checkEmpty(body["pessoa-certificada"]) || !checkAlpha(body["pessoa-certificada"]) ) return { Accept: false, Cause: "Nome da pessoa certificada inválido" };
  if ( checkEmpty(body["nome-curso"]) || !checkAlpha(body["nome-curso"]) ) return { Accept: false, Cause: "Nome do curso inválido" };
  if (!["conclusao", "participacao"].includes(body["tipo-certificado"])) return { Accept: false, Cause: "Tipo de certificado inválido, disponíveis: 'conclusao' e 'participacao'" };
  if (!Array.isArray(body["responsaveis-atividade"])) return { Accept: false, Cause: "O campo 'responsaveis-atividade' deve ser um array" };
  if (body["responsaveis-atividade"].length < 1) return { Accept: false, Cause: "O campo 'responsaveis-atividade' deve conter ao menos um nome" };

  for (const resp of body["responsaveis-atividade"]) {
    if ( checkEmpty(resp) || !checkAlpha(resp) ) return { Accept: false, Cause: "O campo 'responsaveis-atividade' tem algum nome inválido" };
  }
  
  //Melhorar essa validação aqui
  const ci_data = body["cidade-e-data"].split(",");
  const li = ci_data[0].lastIndexOf(" ");
  if ( checkEmpty(body["assinatura"]) || !checkAlpha(body["assinatura"]) ) return { Accept: false, Cause: "Nome da assinatura inválido" };
  if ( checkEmpty(body["cargo-assinatura"]) ) return { Accept: false, Cause: "Cargo da assinatura inválido" };
  return { Accept: true, Cause: "Tudo Ok" };
};

export default async (req, res) => {
  try {
    const {
      pessoa_certificada,
      nome_curso,
      tipo_certificado,
      responsaveis_atividade,
      cidade_e_data,
      nome_assinante,
      cargo_assinatura
    } = req.body;
    const body = {
      "pessoa-certificada": pessoa_certificada,
      "nome-curso": nome_curso,
      "tipo-certificado": tipo_certificado,
      "responsaveis-atividade": responsaveis_atividade,
      "cidade-e-data": cidade_e_data,
      assinatura: nome_assinante,
      "cargo-assinatura": cargo_assinatura
    };
    let link_qr = "https://www.google.com.br";

    const veredito = await validarParametros(body);
    if (!veredito["Accept"]) {
      console.log(veredito);
      return res.status(400).send(veredito["Cause"]).end();
    }

    switch (body["tipo-certificado"]) {
      case "conclusao":
        body["tipo-certificado"] = ", concluiu com exito o(a) ";
        break;
      case "participacao":
        body["tipo-certificado"] = ", participou do(a) ";
        break;
    }

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

    //doc.pipe(fs.createWriteStream('output.pdf'));
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
      __dirname + "/../../public/website/images/logoPET.png",
      doc.page.width / 2 - maxWidth / 2,
      60,
      {
        fit: [maxWidth, maxHeight],
        align: "center"
      }
    );

    function jumpLine(doc, lines) {
      for (let index = 0; index < lines; index++) {
        doc.moveDown();
      }
    }

    jumpLine(doc, 11);

    doc
      .font("Helvetica")
      .fontSize(28)
      .fill("#021c27")
      .font("Times-BoldItalic")
      .text("Certificado de Conclusão", {
        //Ou Participação
        align: "center"
      });

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

    function add_ministrantes(doc, ministrantes) {
      let i = 0;
      const limit = ministrantes.length - 1;
      for (m of ministrantes) {
        doc
          .font("Helvetica-Bold")
          .text(m, { continued: true, align: "justify" });
        if (limit != i++) {
          if (limit == i) {
            doc
              .font("Helvetica")
              .text(" e ", { continued: true, align: "justify" });
          } else {
            doc
              .font("Helvetica")
              .text(", ", { continued: true, align: "justify" });
          }
        }
      }
      doc.font("Helvetica").text(".", { align: "justify" });
    }
    add_ministrantes(doc, body["responsaveis-atividade"]);

    //jumpLine(doc, 11);

    let oldBottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        "Carga horária: 30 horas",
        doc.x,
        doc.page.height - oldBottomMargin,
        {
          align: "center"
        }
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

    //const startLine1 = 128;
    const endLine1 = 128 + lineSize;
    // doc
    //   .moveTo(startLine1, signatureHeight)
    //   .lineTo(endLine1, signatureHeight)
    //   .stroke();

    const startLine2 = endLine1 + 32;
    const endLine2 = startLine2 + lineSize;
    doc
      .moveTo(startLine2, signatureHeight)
      .lineTo(endLine2, signatureHeight)
      .stroke();

    // const startLine3 = endLine2 + 32;
    // const endLine3 = startLine3 + lineSize;
    // doc
    //   .moveTo(startLine3, signatureHeight)
    //   .lineTo(endLine3, signatureHeight)
    //   .stroke();

    // doc
    //   .font('Helvetica')
    //   .fontSize(10)
    //   .fill('#021c27')
    //   .text('John Doe', startLine1, signatureHeight + 10, {
    //     columns: 1,
    //     columnGap: 0,
    //     height: 40,
    //     width: lineSize,
    //     align: 'center',
    //   });

    // doc
    //   .font('Helvetica')
    //   .fontSize(10)
    //   .fill('#021c27')
    //   .text('', startLine1, signatureHeight + 25, {
    //     columns: 1,
    //     columnGap: 0,
    //     height: 40,
    //     width: lineSize,
    //     align: 'center',
    //   });

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
      });

    /*doc
            .font('Helvetica')
            .fontSize(10)
            .fill('#021c27')
            .text(body["cargo-assinatura"], startLine2, signatureHeight + 25, {
                columns: 1,
                columnGap: 0,
                height: 40,
                width: lineSize,
                align: 'center',
            });*/

    // doc
    //   .font('Helvetica')
    //   .fontSize(10)
    //   .fill('#021c27')
    //   .text('Jane Doe', startLine3, signatureHeight + 10, {
    //     columns: 1,
    //     columnGap: 0,
    //     height: 40,
    //     width: lineSize,
    //     align: 'center',
    //   });

    // doc
    //   .font('Helvetica')
    //   .fontSize(10)
    //   .fill('#021c27')
    //   .text('Director', startLine3, signatureHeight + 25, {
    //     columns: 1,
    //     columnGap: 0,
    //     height: 40,
    //     width: lineSize,
    //     align: 'center',
    //   });

    const tamanhoQR = 70;

    doc.image(
      __dirname + "/../../public/website/images/logoUFU.png",
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

      var pdfB64 = "";
      const stream = doc.pipe(new Base64Encode());

      doc.end();

      stream.on("data", (chunk) => {
        pdfB64 += chunk;
      });

      stream.on("end", () => {
        res.status(200).send({ data: pdfB64 });
      });
    });
  } catch (err) {
    res.status(500).send("Erro ao gerar o certificado");
    throw err;
  }
};
