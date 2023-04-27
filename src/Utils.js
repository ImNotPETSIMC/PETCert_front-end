import Axios from "axios";
import Swal from "sweetalert2";
import getCertificate from "./services/getCertificate";

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

export const getCertificatePDF = async ({
  pessoa_certificada,
  nome_curso,
  tipo_certificado,
  responsaveis_atividade,
  cidade_e_data,
  nome_assinante
}) => {
  responsaveis_atividade = String(responsaveis_atividade).split(",");
  responsaveis_atividade.map((string) => string.trim());

  getCertificate({
        pessoa_certificada: pessoa_certificada,
        nome_curso: nome_curso,
        tipo_certificado: tipo_certificado,
        responsaveis_atividade: responsaveis_atividade,
        cidade_e_data: cidade_e_data,
        nome_assinante: nome_assinante,
        cargo_assinatura: "Tutor"
    })
    .then((response) => {
      if(response.data) return response.data;
      else(swalError(response.Cause));
    })
    .then(async (response) => {
        const unsignedCertificateB64 = response.data;
        const signedCertificate = await signCertificate(unsignedCertificateB64);
        downloadPDF(signedCertificate);
    })
    .catch((err) => {
      console.log(err)
        swalError(err);
    });
};

export const signCertificate = async (certificateB64) => {
  try {
    const req = await Axios.post("http://localhost:8500/signature/sign", {
      data: certificateB64
    });

    const response = req.data;

    const signedCertificateB64 = response.signedPDF;

    return signedCertificateB64;
  } catch (error) {
    swalError(error.message);
    throw error;
  }
};

const swalError = (errorMessage) => {
  Swal.fire({
    icon: "error",
    title: "SOLICITAÇÃO FALHOU",
    text: errorMessage,
    background: "#D0D0D0FF",
    confirmButtonColor: "#1B1F22"
  });
};
