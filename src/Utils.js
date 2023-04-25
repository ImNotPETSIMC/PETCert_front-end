import Axios from "axios";
import Swal from "sweetalert2";

export const generateInput = (name, fn) => {
  const aux = String(name).replace(" ", "_");
  const id = String(aux).toLowerCase();

  return (
    <div className={id + "-container"}>
      <input type="text" name={id} id={id} placeholder={name} onChange={fn} />
      <label htmlFor={id}>{name.toUpperCase()}</label>
    </div>
  );
};

export const downloadPDF = (pdf) => {
  const sourceLink = `data:application/pdf;base64,${pdf}`;
  const download = document.createElement("a");
  const fileName = "PET_Certificate.pdf";
  download.href = sourceLink;
  download.download = fileName;
  download.click();
};

export const getCertificate = async ({
  pessoa_certificada,
  nome_curso,
  tipo_certificado,
  responsaveis_atividade,
  cidade_e_data,
  nome_assinante
}) => {
  responsaveis_atividade = String(responsaveis_atividade).split(",");
  responsaveis_atividade.map((string) => string.trim());

  Axios.post("http://localhost:8000/getCertificado", {
    pessoa_certificada: pessoa_certificada,
    nome_curso: nome_curso,
    tipo_certificado: tipo_certificado,
    responsaveis_atividade: responsaveis_atividade,
    cidade_e_data: cidade_e_data,
    nome_assinante: nome_assinante,
    cargo_assinatura: "Tutor"
  })
    .then((response) => response.data)
    .then(async (response) => {
      const unsignedCertificateB64 = response.data;
      const signedCertificate = await signCertificate(unsignedCertificateB64);
      downloadPDF(signedCertificate);
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "SOLICITAÇÃO FALHOU",
        text: err.response.data,
        background: "#D0D0D0FF",
        confirmButtonColor: "#1B1F22"
      });
    });
};

export const signCertificate = async (certificateB64) => {
  const req = await Axios.post("http://localhost:8500/signature/sign", {
    data: certificateB64
  });

  const response = req.data;

  const signedCertificateB64 = response.signedPDF;

  return signedCertificateB64;
};
