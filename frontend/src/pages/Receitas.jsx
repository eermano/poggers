import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { useOutletContext } from 'react-router-dom';
import Modal from '../components/Modal';
import './Receitas.css';

const API_URL = 'http://localhost:8000/api/receitas';

const Receitas = () => {
  const [isRecipeDetailModalOpen, setIsRecipeDetailModalOpen] = useState(false);
  const [selectedRecipeContent, setSelectedRecipeContent] = useState({ title: '', content: '' });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [recipeToDeleteId, setRecipeToDeleteId] = useState(null);

  const { receitas, fetchReceitas } = useOutletContext();

  const extractTitleFromMarkdown = (markdownContent) => {
    const firstLine = markdownContent.split('\n')[0];
    if (firstLine && firstLine.startsWith('#')) {
      return firstLine.replace(/^#+\s*/, '').trim();
    }
    return "Receita sem título";
  };

  const confirmDelete = async () => {
    if (!recipeToDeleteId) return;

    const toastId = toast.loading("Excluindo receita...");
    try {
      await axios.delete(`${API_URL}/${recipeToDeleteId}`);
      fetchReceitas(); // Call the fetchReceitas from context to update the list
      toast.update(toastId, { render: "Receita excluída com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
      toast.update(toastId, { render: "Erro ao excluir receita!", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setRecipeToDeleteId(null);
  };

  const handleDeleteRecipe = (id) => {
    setRecipeToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipeContent({ title: recipe.displayTitle, content: recipe.conteudo });
    setIsRecipeDetailModalOpen(true);
  };

  const closeRecipeDetailModal = () => {
    setIsRecipeDetailModalOpen(false);
    setSelectedRecipeContent({ title: '', content: '' });
  };

  return (
    <div className="receitas-container">
      <h1>Minhas Receitas Salvas</h1>
      {receitas.length === 0 ? (
        <p className="no-receitas-message">Nenhuma receita salva ainda.</p>
      ) : (
        <div className="receitas-list">
          {receitas.map((receita) => (
            <div key={receita.id} className="receita-item">
              <div>
                <h2>{receita.displayTitle}</h2>
                {receita.created_at && (
                  <p className="recipe-created-at">Criado em: {new Date(receita.created_at).toLocaleString()}</p>
                )}
              </div>
              <div className="receita-actions">
                <button className="view-recipe-btn" onClick={() => handleViewRecipe(receita)}>Ver</button>
                <button className="delete-recipe-btn" onClick={() => handleDeleteRecipe(receita.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isRecipeDetailModalOpen} onClose={closeRecipeDetailModal}>
        <div className="modal-body">
          <div className="recipe-content">
            <ReactMarkdown>{selectedRecipeContent.content}</ReactMarkdown>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={closeRecipeDetailModal}>Fechar</button>
        </div>
      </Modal>

      <Modal isOpen={isConfirmModalOpen} onClose={cancelDelete}>
        <div className="modal-body">
          <h2>Confirmar Exclusão</h2>
          <p>Tem certeza que deseja excluir esta receita?</p>
        </div>
        <div className="modal-footer">
          <button onClick={cancelDelete}>Cancelar</button>
          <button className="delete-recipe-btn" onClick={confirmDelete}>Excluir</button>
        </div>
      </Modal>
    </div>
  );
};

export default Receitas;
