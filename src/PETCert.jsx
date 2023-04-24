import { generateInput } from './Utils';
import './styles/PETCert.css';
import Axios from "axios";


function PETCert() {
    const getCertificate = () => {
        Axios.post("http://localhost:8000/getCertificado", {
            headers: { "Content-Type": "application/json" },
            body: {
                "pessoa-certificada": 'Vinicius Pires Barreto',
                "nome-curso": 'Minicurso de GIT',
                "tipo-certificado": 'conclusao',
                "responsaveis-atividade": ['Yan Gustavo Pegyn Silva', 'Roberto Costa Tupinambá'],
                "cidade-e-data": 'Monte Carmelo MG, 06 de fevereiro de 2023',
                "nome-assinante": 'Silvio',
                "cargo-assinatura": 'Tutor'
            }
        })
        .then(response => console.log(response.data))
    }

    
    const inputNames = ["Nome Curso", "Tipo Certificado", "Pessoa Certificada", "Responsaveis Atividade", "Cidade e Data", "Nome Assinante"];
    
    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                {inputNames.map((input) => generateInput(input))}
                <button type="submit" id='getCertificate' onClick={() => {getCertificate()}}>GERAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCert;