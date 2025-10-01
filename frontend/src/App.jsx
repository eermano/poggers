import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import './App.css';

const API_URL = 'http://localhost:8000/api';
const MAX_RETRIES = 3;

function App() {
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipeData, setRecipeData] = useState({ titulo: '', conteudo: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [receitas, setReceitas] = useState([]); // Centralized recipes state

  useEffect(() => {
    if (isRecipeModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isRecipeModalOpen]);

  useEffect(() => {
    fetchReceitas();
  }, []); // Call fetchReceitas on initial mount

  // Centralized fetch for recipes
  const fetchReceitas = async () => {
    try {
      const response = await axios.get(`${API_URL}/receitas`);
      const processedReceitas = response.data.map(receita => ({
        ...receita,
        displayTitle: extractTitleFromMarkdown(receita.conteudo)
      }));
      setReceitas(processedReceitas);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      toast.error("Erro ao carregar receitas!");
    }
  };

  // Helper to extract title from markdown, moved here for centralization
  const extractTitleFromMarkdown = (markdownContent) => {
    const firstLine = markdownContent.split('\n')[0];
    if (firstLine && firstLine.startsWith('#')) {
      return firstLine.replace(/^#+\s*/, '').trim();
    }
    return "Receita sem título";
  };

  const handleGerarReceita = async () => {
    const toastId = toast.loading("Gerando receita...");
    setIsLoading(true);
    if (!isRecipeModalOpen) {
      setIsRecipeModalOpen(true);
    }

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const response = await axios.get(`${API_URL}/receitas/gerar`);
        setRecipeData({ titulo: 'Poggers', conteudo: response.data });
        toast.update(toastId, { render: "Receita gerada com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
        setIsLoading(false);
        return; // Exit after successful generation
      } catch (error) {
        console.error(`Erro ao gerar receita (tentativa ${i + 1}/${MAX_RETRIES}):`, error);
        const errorMessage = error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Erro ao gerar receita!";

        // Specific handling for 'missing ingredients' error
        if (errorMessage.includes("precisa cadastrar alguns ingredientes")) {
          toast.update(toastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 5000 });
          closeRecipeModal();
          setIsLoading(false);
          return; // Exit immediately, no retries
        }

        if (i < MAX_RETRIES - 1) {
          toast.update(toastId, { render: `Falha na geração. Tentando novamente... (${i + 1}/${MAX_RETRIES})`, type: "warning", isLoading: true });
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); 
        }
      }
    }

    const finalErrorMessage = error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : "Erro ao gerar receita após várias tentativas!";
    toast.update(toastId, { render: finalErrorMessage, type: "error", isLoading: false, autoClose: 3000 });
    closeRecipeModal();
    setIsLoading(false);
  };

  const handleSaveRecipe = async () => {
    if (!recipeData.titulo || !recipeData.conteudo) return;
    const toastId = toast.loading("Salvando receita...");
    try {
      await axios.post(`${API_URL}/receitas`, recipeData);
      toast.update(toastId, { render: "Receita salva com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
      closeRecipeModal();
      fetchReceitas(); // Re-fetch recipes after saving
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      toast.update(toastId, { render: "Erro ao salvar receita!", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false);
    setRecipeData({ titulo: '', conteudo: '' });
  };

  return (
    <>
      <Sidebar onGerarReceita={handleGerarReceita} isLoading={isLoading} />
      <main className="main-content">
        <Outlet context={{ receitas, fetchReceitas }} />
      </main>

      <Modal isOpen={isRecipeModalOpen} onClose={closeRecipeModal} className="modal-large">
        <div className="modal-body">
          {isLoading ? (
            <h2>Gerando receita...</h2>
          ) : (
            <>
              <div className="sidebar-header modal-recipe-title-fixed">
                <span className="sidebar-icon">P</span>
                <h1 className="sidebar-title">Poggers</h1>
              </div>
              {recipeData.conteudo && 
                <div className="recipe-content">
                  <ReactMarkdown>{recipeData.conteudo}</ReactMarkdown>
                </div>
              }
            </>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeRecipeModal}>Fechar</button>
          <button onClick={handleGerarReceita} disabled={isLoading}>
            {isLoading ? 'Gerando...' : 'Gerar de novo'}
          </button>
          <button onClick={handleSaveRecipe} disabled={isLoading || !recipeData.titulo}>
            Salvar
          </button>
        </div>
      </Modal>
      <ToastContainer position="top-right" theme="dark" />
    </>
  );
}

export default App;