import Input from './components/Input';
import { useState } from 'react';
import { getCertificate } from './Utils';
import { PDF64_API, BACKEND_API } from './getEnv';
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

    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                {inputNames.map( (input) => { return <Input name={input} fn={handleChange}/> }  )   }
                <button type="submit" id='getCertificate' onClick={() => { getCertificate(PDF64_API, BACKEND_API, inputValues); }}>GERAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCert;