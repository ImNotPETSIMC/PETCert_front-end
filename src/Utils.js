import Axios from "axios";
import Swal from "sweetalert2";
import pdfIcon from './assets/pdf-ico.svg'

export const generateInput = (name, fn) => {
  const aux = String(name).replace(" ", "_");
  const id = String(aux).toLowerCase();

  return (
    <div className="input-container" key={id}>
      <input type="text" name={id} id={id} placeholder={name} onChange={fn} />
      <label htmlFor={id}>{name.toUpperCase()}</label>
    </div>
  );
};

export const generateRadio = (name, fn) => {
  const aux = String(name).replace(" ", "_");
  const id = String(aux).toLowerCase();

  return (
    <div className="radio-container" key={id}>
      <input type="radio" name="nav-bar" id={id} value={id}/>
      <label htmlFor={id} name={name} onClick={fn}>{name}</label>
    </div>
  )
};

export const generateCertificateContainer = ({data, hashPdf, hashSignedPdf, signedPdf}) => { 
  
  return (
    <div className='certificate-container'>
      <div className='pdf-container'>
          <div className='button-container'>
              <button><img src={pdfIcon} alt="" onClick={() => downloadPDF(data)}/></button>
              <label htmlFor="">PDF Original</label>
          </div>
          <div className='hash-container'>
              <input readOnly type="text" value={hashPdf}/>
              <label>Hash Original</label>
          </div>
      </div>
      <div className='pdf-container'>
          <div className='hash-container'>
              <input readOnly type="text" value={hashSignedPdf}/>
              <label>Hash Assinado</label>
          </div>
          <div className='button-container'>
              <button><img src={pdfIcon} alt="" onClick={ () => downloadPDF(signedPdf) } /></button>
              <label htmlFor="">PDF Assinado</label>
          </div>
      </div>
    </div>
  )
}

export const downloadPDF = (pdf) => {
  const sourceLink = `data:application/pdf;base64,${pdf}`;
  const download = document.createElement("a");
  const fileName = "PET_Certificate.pdf";
  download.href = sourceLink;
  download.download = fileName;
  download.click();
};

export const getCertificate = async (getPDF_url, signPDF_url, {
  pessoa_certificada,
  nome_curso,
  tipo_certificado,
  responsaveis_atividade,
  cidade_e_data,
  nome_assinante
}) => {
  responsaveis_atividade = String(responsaveis_atividade).split(",");
  responsaveis_atividade.map((string) => string.trim());

  Axios.post(`${getPDF_url}/getCertificado`, {
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
      const signedCertificate = await signCertificate(signPDF_url, unsignedCertificateB64);
      downloadPDF(signedCertificate);
    })
    .catch((err) => {
      swalError(err.response.data);
    });
};

export const signCertificate = async (signPDF_url, certificateB64) => {
  try {
    const req = await Axios.post(`${signPDF_url}/signature/sign`, {
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

export const verifyCertificate = async (verifyPDF_url, {
  data,
  originalHash
}) => {
  try {
    const req = await Axios.post(`${verifyPDF_url}/signature/verify`, {
      data: data,
      originalHash: originalHash
    });

    const response = req.data;
    swalSuccess(response.response.message);
  } catch (error) {
    swalError(error.response.data.error);
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

const swalSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "SOLICITAÇÃO SUCEDIDA",
    text: message,
    background: "#D0D0D0FF",
    confirmButtonColor: "#1B1F22"
  });
}
