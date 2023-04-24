import { generateInput } from './Utils';
import './styles/PETCert.css'


function PETCert() {
    const inputNames = ["Nome Curso", "Tipo Certificado", "Pessoa Certificada", "Responsaveis Atividade", "Cidade e Data", "Nome Assinante"];
    
    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                {inputNames.map((input) => generateInput(input))}
                <button type="submit" id='getCertificate'>GERAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCert;