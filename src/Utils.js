import Axios from "axios";
import Swal from "sweetalert2";
import { PASSWORD, USERNAME } from "./getEnv";
import md5 from "md5";

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
  swalAlert("Seu certificado está em processo.");
  
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
      data: certificateB64,
      headers: {                  
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization", 
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      }
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
  swalAlert("Seu pedido de verificação está em processo.");
  
  try {
    const req = await Axios.post(`${verifyPDF_url}/signature/verify`, {
      data: data,
      originalHash: originalHash,
      headers: {                  
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization", 
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      }
    });

    const response = req.data;
    swalSuccess(response.response.message);
  } catch (error) {
    swalError(error.response.data.error);
  }
};

export const swalError = (errorMessage) => {
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
};

const swalAlert = (message) => {
  Swal.fire({
    icon: "info",
    title: "SOLICITAÇÃO EM ANDAMENTO",
    text: message,
    background: "#D0D0D0FF",
    confirmButtonColor: "#1B1F22",
    timer: 5000
  });
};

export const normalizeString = (string, type) => {
  string = String(string);
  if(string.replace(/\s+/g, ' ').trim().length <= 1) return string;
  const dontCapitalize = ["de", "da", "do", "janeiro", "fevereiro", "março", "abril", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  if(type !== "tipo_certificado") {
    return String(string).replace(/\s+/g, ' ').trim().split(" ").map(word => { 
      if(dontCapitalize.includes(word)) return word;
      return word[0].toUpperCase() + word.slice(1);
    }).join(" ").trim();
  }
  return string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

export const authCheck = (username, password) => {  
  const userRef = username ? md5(username) : "null";
  const passwordRef = password ? md5(password) : "null";

  localStorage.setItem("username", username); 
  localStorage.setItem("password", password); 

  if(userRef !== USERNAME || passwordRef !== PASSWORD ) return false;
  return true;
};

export const getDate = () => {
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const date = new Date();
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`; 
};

export const keyListener = (listener, button, type) => {
  if(type === "add"){
    return (
      listener.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          button.click();
        }
      })
    )
  }

  if(type === "remove"){
    return (
      listener.removeEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          button.click();
        }
      })
    )
  }

};