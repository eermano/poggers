import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onGerarReceita, isLoading }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-icon">P</span>
        <h1 className="sidebar-title">Poggers</h1>
      </div>
      <button className="btn-gerar-receita" onClick={onGerarReceita} disabled={isLoading}>
        {isLoading ? 'Gerando...' : 'Gerar receita'}
      </button>
      <nav className="sidebar-nav">
        <Link to="/alimentos">Alimentos</Link>
        <Link to="/receitas">Receitas</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
