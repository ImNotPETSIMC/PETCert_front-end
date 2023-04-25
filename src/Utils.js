import Axios from "axios";

export const generateInput = (name, label) => {
    const aux = String(name).replace(' ', '-');
    const id = String(aux).toLowerCase();
    
    if(!label){
        return (
            <div className={id +"-container"}>
                <input type="text" name="" id={id} placeholder={name}/>
                <label htmlFor={id}>{name.toUpperCase()}</label>
            </div>
        )
    };
    
    return (
        <div className={id +"-container"}>
            <input type="text" name="" id={id} placeholder={name}/>
            <label htmlFor={id}>{label.toUpperCase()}</label>
        </div>
    )
}

export const getCertificate = (pessoa_certificada, nome_curso, tipo_certificado, responsaveis_atividade, cidade_e_data, nome_assinante) => {
    Axios.post("http://localhost:8000/getCertificado", {
        pessoa_certificada: pessoa_certificada,
        nome_curso: nome_curso,
        tipo_certificado: tipo_certificado,
        responsaveis_atividade: responsaveis_atividade,
        cidade_e_data: cidade_e_data,
        nome_assinante: nome_assinante,
        cargo_assinatura: 'Tutor'
    })
    .then(response => console.log(response.data))
}