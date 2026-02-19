import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import MockDataButtons from './components/MockDataButtons';
import PessoasPage from './pages/PessoasPage';
import CategoriasPage from './pages/CategoriasPage';
import TransacoesPage from './pages/TransacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConversaoMoedasPage from './pages/ConversaoMoedasPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<PessoasPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/conversao-moedas" element={<ConversaoMoedasPage />} />
      </Routes>
      <MockDataButtons />
    </BrowserRouter>
  );
}

export default App;
