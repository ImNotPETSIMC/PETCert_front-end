import { useState } from 'react';
import { verifyCertificate } from './Utils';
import { BACKEND_API } from './getEnv';
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

    const pdfToB64 = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onloadend = () => { 
            setInputValues((prevState) => { return { ...prevState, data: fileReader.result.split(',')[1], }})
        }
    }

    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                <div className="pdf-container" key="Certificado">
                    <input type="text" id="data-name" placeholder="PDF do Certificado" disabled />
                    <input type="file" name="data" id="Certificado" onChange={() => {
                        if(document.getElementById("Certificado").files.length){
                            const file = document.getElementById("Certificado").files[0];
                            pdfToB64(file);
                            document.getElementById("data-name").value = file.name;
                        }
                    }} accept='.pdf'/>
                    <label htmlFor="Certificado">{"Certificado".toUpperCase()}</label>
                </div>
                <div className="key-container" key="pdfKey">
                    <input type="text" name="originalHash" id="pdfKey" placeholder="Assinatura" onChange={handleChange} />
                    <label htmlFor="pdfKey">{"chave".toUpperCase()}</label>
                </div>
                <button type="submit" id='verifyCertificate' onClick={() => { verifyCertificate(BACKEND_API, inputValues); }}>VERIFICAR CERTIFICADO</button>
            </div>
        </div>
    );
}

export default PETCertVerify;