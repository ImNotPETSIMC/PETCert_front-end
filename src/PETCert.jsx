import Input from './components/Input';
import { useState } from 'react';
import { authCheck, swalError } from './Utils';
import './styles/PETCert.css';

const PETCert = () => {   
    const inputNames = [{name: "Usuário de Acesso", value: "username", info:"Usuário de Acesso ao PETCert"}, {name: "Senha de Acesso", value: "password", info:"Senha de Acesso ao PETCert", password: true}];
    const [inputValues, setInputValues] = useState({ username:"", password: ""});

    const handleChange = (event) => {
        const {name, value} = event.target;
        setInputValues((prevState) => { return { ...prevState, [name]: value, }});
    };

    const logIn = (username, password) => { 
        if(authCheck(username, password)) window.location.reload();
        else swalError("Usuário ou Senha Incorreta");
    };
    
    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container' className='getPassword-container'>
                {inputNames.map((input) => { return <Input key={input.value + "-input"} value={input.value} name={input.name} info={input.info} fn={handleChange} password={input.password}/> })}
                <button type="submit" id='getPassword' onClick={() => { logIn(inputValues.username, inputValues.password); }}>FAZER LOGIN</button>
            </div>
        </div>
    );
}

export default PETCert;