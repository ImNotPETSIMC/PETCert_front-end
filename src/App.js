import './styles/App.css';
import PETCert from './PETCert';
import PETLogo from './assets/logo.jpeg'
import { generateRadio } from './Utils';
import PETCertVerify from './PETCertVerifiy';

function App() {
  const navOptions = ["Gerar", "Verificar", "Historico"]

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div id="logo"><img src={PETLogo} alt="PET-SIMC Logo" /></div>
        {/* <PETCert /> */}
        <PETCertVerify/>
        <nav><div>{navOptions.map((option, index) => generateRadio(option, index))}</div></nav>
      </main>
      <footer>© 2023 - Sistemas de Informação. Todos os direitos reservados.</footer>
    </div>
  );
}

export default App;
