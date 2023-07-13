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
  const [ password ] = useState(localStorage.getItem("password"));
  
  const generateScreen = (option) => {
    if(!authCheck(password)) return <PETCert />
    if(option === "Gerar") return <PETCertGenerate/>
    if(option === "Verificar") return <PETCertVerify />
    if(option === "Historico") return <PETCertHistory />
    if(option === "Deslogar") localStorage.clear(); window.location.reload();
  }

  const handleChange = (event) => setNavSelected(event.target.getAttribute('name'));

  if(!authCheck(password)) return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div id="logo"><img src={PETLogo} alt="PET-SIMC Logo" /></div>
        {generateScreen(navSelected)}
      </main>
      <footer>© 2023 - Sistemas de Informação. Todos os direitos reservados.</footer>
    </div>
  )


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
