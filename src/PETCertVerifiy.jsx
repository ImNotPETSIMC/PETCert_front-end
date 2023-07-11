import { useState } from 'react';
import './styles/PETCert.css';

const PETCertVerify = () => {   
    const [inputValues, setInputValues] = useState({
        data: "",
        originalHash: "",
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setInputValues((prevState) => { return { ...prevState, [name]: value, } });
    };

    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                <div className="pdf-container" key="Certificado">
                    <input type="text" id="data-name" placeholder="PDF do Certificado" disabled />
                    <input type="file" name="data" id="Certificado" onChange={(event) => {
                        handleChange(event);
                        document.getElementById("data-name").value = document.getElementById("Certificado").files[0].name;
                    }} accept='.pdf'/>
                    <label htmlFor="Certificado">{"Certificado".toUpperCase()}</label>
                </div>
                <div className="key-container" key="pdfKey">
                    <input type="text" name="originalHash" id="pdfKey" placeholder="Assinatura" onChange={handleChange} />
                    <label htmlFor="pdfKey">{"chave".toUpperCase()}</label>
                </div>
                <button type="submit" id='getCertificate' onClick={() => { console.log(inputValues) }}>VERIFICAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCertVerify;