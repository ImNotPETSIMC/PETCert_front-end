import './styles/PETCert.css'

const generateInput = (name, label) => {
    const aux = String(name).replace(' ', '-');
    const id = String(aux).toLowerCase();
    
    if(!label){
        return (
            <div className={id +"-container"}>
                <input type="text" name="" id={id} />
                <label htmlFor={id}>{name.toUpperCase()}</label>
            </div>
        )
    };
    
    return (
        <div className={id +"-container"}>
            <input type="text" name="" id={id} />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

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