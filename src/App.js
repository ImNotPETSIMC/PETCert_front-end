import './styles/App.css';
import PETCert from './PETCert';
import PETLogo from './assets/logo.jpeg'

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <div id="logo"><img src={PETLogo} alt="PET-SIMC Logo" srcset="" /></div>
        <PETCert />
      </main>
      <footer>© 2023 - Sistemas de Informação. Todos os direitos reservados.</footer>
    </div>
  );
}

export default App;
