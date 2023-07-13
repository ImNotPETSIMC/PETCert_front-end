import Radio from './components/Radio';
import PETLogo from './assets/logo.jpeg'
import PETCert from './PETCertGenerate';
import PETCertVerify from './PETCertVerify';
import PETCertHistory from './PETCertHistory';
import { useState } from 'react';
import './styles/App.css';

function App() {
  const navOptions = ["Gerar", "Verificar", "Historico"]
  const [navSelected, setNavSelected] = useState("Gerar");
  
  const generateScreen = (option) => {
    if(option === "Gerar") return <PETCert/>
    if(option === "Verificar") return <PETCertVerify />
    if(option === "Historico") return <PETCertHistory />
  }

  const handleChange = (event) => setNavSelected(event.target.getAttribute('name'));

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div id="logo"><img src={PETLogo} alt="PET-SIMC Logo" /></div>
        {generateScreen(navSelected)}
        <nav><div>{navOptions.map((option) => { return <Radio key={option + "-radio"} name={option} fn={handleChange}/> })}</div></nav>
      </main>
      <footer>© 2023 - Sistemas de Informação. Todos os direitos reservados.</footer>
    </div>
  );
}

export default App;
