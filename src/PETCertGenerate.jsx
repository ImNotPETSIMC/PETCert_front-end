import Input from './components/Input';
import { useState, useEffect } from 'react';
import { getCertificate, getDate, keyListener, normalizeString } from './Utils';
import { PDF64_API, BACKEND_API } from './getEnv';
import './styles/PETCert.css';

const PETCertGenerate = () => {   
    const inputNames = [{name: "Nome do Curso", value: "nome_curso", info:"Ex: Minicurso de Git"}, {name:"Tipo de Certificado", value:"tipo_certificado", info:"Conclusão ou Participação"}, {name: "Pessoa Certificada", value:"pessoa_certificada", info:"Ex: João da Silva Santos"}, {name: "Responsáveis pela Atividade", value: "responsaveis_atividade", info:"Ex: Lucas Maciel, Enzo Weder"}, { name: "Cidade e Data", value: "cidade_e_data", info: `Ex: Monte Carmelo, ${getDate()}`}, { name: "Nome do Assinante", value: "nome_assinante", info: "Nome do Tutor do PET-SIMC"}];
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
        setInputValues((prevState) => { return { ...prevState, [name]: normalizeString(value, name), }});
    };

    useEffect(() => {
        const getCertificateButton = document.getElementById("getCertificate");

        keyListener(window, getCertificateButton, "add");

        return () => { keyListener(window, getCertificateButton, "remove"); }
    }, []);

    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                {inputNames.map((input) => { return <Input key={input.value + "-input"} value={input.value} name={input.name} info={input.info} fn={handleChange}/> })}
                <button type="submit" id='getCertificate' onClick={() => { getCertificate(PDF64_API, BACKEND_API, inputValues); }}>GERAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCertGenerate;