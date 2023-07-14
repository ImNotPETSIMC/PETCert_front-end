import Radio from './components/Radio';
import PETLogo from './assets/logo.jpeg'
import PETCert from './PETCert';
import PETCertGenerate from './PETCertGenerate';
import PETCertVerify from './PETCertVerify';
import PETCertHistory from './PETCertHistory';
import { useState } from 'react';
import { authCheck } from './Utils';
import './styles/App.css';


function App() {
  const navOptions = ["Gerar", "Verificar", "Historico", "Deslogar"]
  const [navSelected, setNavSelected] = useState("Gerar");
  const [ username ] = useState(localStorage.getItem("username"));
  const [ password ] = useState(localStorage.getItem("password"));
  const isLogged = authCheck(username, password);
  
  const generateScreen = (option) => {

    if(!isLogged) return <PETCert />
    if(option === "Gerar") return <PETCertGenerate/>
    if(option === "Verificar") return <PETCertVerify />
    if(option === "Historico") return <PETCertHistory />
    if(option === "Deslogar") localStorage.clear(); window.location.reload();
  }

  const navBar = (isLogged) => {
    if(isLogged) return (
      <nav><div>{navOptions.map((option) => { return <Radio key={option + "-radio"} name={option} fn={handleChange}/> })}</div></nav>
    )
  }

  const handleChange = (event) => setNavSelected(event.target.getAttribute('name'));

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div id="logo"><img src={PETLogo} alt="PET-SIMC Logo" /></div>
        {generateScreen(navSelected)}
        {navBar(isLogged)}
      </main>
      <footer>© {new Date().getFullYear()} - Sistemas de Informação. Todos os direitos reservados.</footer>
    </div>
  );
}

export default App;
