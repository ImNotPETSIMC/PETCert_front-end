import Axios from "axios";
import { Base64 } from 'js-base64';
import FileSaver from 'file-saver';

export const generateInput = (name, fn) => {
    const aux = String(name).replace(' ', '_');
    const id = String(aux).toLowerCase();

    return (
        <div className={id +"-container"}>
            <input type="text" name={id} id={id} placeholder={name} onChange={fn}/>
            <label htmlFor={id}>{name.toUpperCase()}</label>
        </div>
    )
}

export const getCertificate = ({pessoa_certificada, nome_curso, tipo_certificado, responsaveis_atividade, cidade_e_data, nome_assinante}) => {
    responsaveis_atividade = String(responsaveis_atividade).split(",");
    responsaveis_atividade.map((string) => string.trim());

    Axios.post("http://localhost:8000/getCertificado", {
        pessoa_certificada: pessoa_certificada,
        nome_curso: nome_curso,
        tipo_certificado: tipo_certificado,
        responsaveis_atividade: responsaveis_atividade,
        cidade_e_data: cidade_e_data,
        nome_assinante: nome_assinante,
        cargo_assinatura: 'Tutor'
    })
    .then(response => response.data)
    .then(response => Base64.atob(response.data))
    .then((response) => {
        const blob = new Blob([response], { type: 'data:application/pdf;base64,' + response, });
        FileSaver.saveAs(blob, 'test.pdf');
    });
};