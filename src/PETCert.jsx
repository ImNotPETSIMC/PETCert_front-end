import './styles/PETCert.css'

const generateInput = (name, label) => {
    const aux = String(name).replace(' ', '-');
    const id = String(aux).toLowerCase();
    
    if(!label){
        return (
            <div className={id +"-container"}>
                <input type="text" name="" id={id} />
                <br />
                <label htmlFor={id}>{name}</label>
            </div>
        )
    };
    
    return (
        <div className={id +"-container"}>
            <input type="text" name="" id={id} />
            <br />
            <label htmlFor={id}>{label}</label>
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