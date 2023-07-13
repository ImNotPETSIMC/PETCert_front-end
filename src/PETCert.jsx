import Input from './components/Input';
import { useState } from 'react';
import { authCheck, swalError } from './Utils';
import './styles/PETCert.css';

const PETCert = () => {   
    const inputNames = [{name: "Senha de Acesso", value: "password", info:"Senha de Acesso ao Projeto PETCert"}];
    const [inputValues, setInputValues] = useState({ password: "", });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setInputValues((prevState) => { return { ...prevState, [name]: value, }});
    };

    const logIn = password => { 
        if(authCheck(password)) window.location.reload();
        else swalError("Senha Incorreta");
    };
    
    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container' className='getPassword-container'>
                {inputNames.map((input) => { return <Input key={input.value + "-input"} value={input.value} name={input.name} info={input.info} fn={handleChange} password={true}/> })}
                <button type="submit" id='getPassword' onClick={() => { logIn(inputValues.password); }}>FAZER LOGIN</button>
            </div>
        </div>
    );
}

export default PETCert;