import { useState } from 'react';
import { downloadPDF, generateInput, getB64PDF } from './Utils';
import './styles/PETCert.css';


function PETCert() {   
    const inputNames = ["Nome Curso", "Tipo Certificado", "Pessoa Certificada", "Responsaveis Atividade", "Cidade e Data", "Nome Assinante"];
    const [inputValues, setInputValues] = useState({
        pessoa_certificada: "",
        nome_curso: "",
        tipo_certificado: "",
        responsaveis_atividade: "",
        cidade_e_data: "",
        nome_assinante: ""
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setInputValues((prevState) => { return { ...prevState, [name]: value, } });
    };

    const getCert = async (values) => {
        const response = await getB64PDF(values);
        downloadPDF(response);
    }


    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                {inputNames.map((input) => generateInput(input, handleChange))}
                <button type="submit" id='getCertificate' onClick={() => { getCert(inputValues) }}>GERAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCert;