import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          Controle Financeiro
        </div>
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </Link>
        <Link to="/pessoas" className={`nav-link ${isActive('/pessoas') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">person</span>
          Pessoas
        </Link>
        <Link to="/categorias" className={`nav-link ${isActive('/categorias') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">category</span>
          Categorias
        </Link>
        <Link to="/transacoes" className={`nav-link ${isActive('/transacoes') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">receipt_long</span>
          Transações
        </Link>
        <Link to="/relatorios" className={`nav-link ${isActive('/relatorios') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">analytics</span>
          Relatórios
        </Link>
        <Link to="/conversao-moedas" className={`nav-link ${isActive('/conversao-moedas') ? 'active' : ''}`}>
          <span className="material-symbols-outlined">currency_exchange</span>
          Conversão
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
