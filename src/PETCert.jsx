import './styles/PETCert.css'

const generateInput = (name, label) => {
    const aux = String(name).replace(' ', '-');
    const id = String(aux).toLowerCase();
    
    if(!label){
        return (
            <div>
                <label htmlFor={id}>{name}</label>
                <input type="text" name="" id={id} />
            </div>
        )
    };
    
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input type="text" name="" id={id} />
        </div>
    )
}

function PETCert() {
    const inputNames = ["Nome Curso", "Tipo Certificado", "Pessoa Certificada", "Responsaveis Atividade", "Cidade e Data", "Nome Assinante"];
    
    return (
        <div className="PETCert">
            <h1>PETCert</h1>
            <div id='inputs-container'>{inputNames.map((input) => generateInput(input))}</div>
            <button type="submit" id='getCertificate'>Gerar Certificado</button>
        </div>
    );
}

export default PETCert;