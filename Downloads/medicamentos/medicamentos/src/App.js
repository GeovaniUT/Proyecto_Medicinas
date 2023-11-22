import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogIn from './componentes/LogIn';
import Registro from './componentes/Registro';
import TablaM from './componentes/TablaM';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/Registro" element={<Registro />} />
        <Route path="/TablaM" element={<TablaM />} />
        
      </Routes>
    </BrowserRouter>
  );
}
export default App;
