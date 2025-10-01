import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import '../App.css';

const API_URL = 'http://localhost:8000/api/alimentos';

const Alimentos = () => {
  const [alimentos, setAlimentos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    unidade_de_medida: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [alimentoToDeleteId, setAlimentoToDeleteId] = useState(null);

  useEffect(() => {
    fetchAlimentos();
  }, []);

  const fetchAlimentos = async () => {
    try {
      const response = await axios.get(API_URL);
      // Sort by updated_at in descending order (most recent first)
      const sortedAlimentos = response.data.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      setAlimentos(sortedAlimentos);
    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
      toast.error("Erro ao buscar alimentos!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.quantidade || !formData.unidade_de_medida) {
      toast.warn("Por favor, preencha todos os campos.");
      return;
    }

    const toastId = toast.loading(editingId ? "Atualizando alimento..." : "Adicionando alimento...");
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        toast.update(toastId, { render: "Alimento atualizado com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        await axios.post(API_URL, formData);
        toast.update(toastId, { render: "Alimento adicionado com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
      }
      fetchAlimentos();
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar alimento:", error);
      toast.update(toastId, { render: "Erro ao salvar alimento!", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleEdit = (alimento) => {
    setEditingId(alimento.id);
    setFormData({
      nome: alimento.nome,
      quantidade: alimento.quantidade,
      unidade_de_medida: alimento.unidade_de_medida
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!alimentoToDeleteId) return;

    const toastId = toast.loading("Excluindo alimento...");
    try {
      await axios.delete(`${API_URL}/${alimentoToDeleteId}`);
      fetchAlimentos();
      toast.update(toastId, { render: "Alimento excluído com sucesso!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Erro ao excluir alimento:", error);
      toast.update(toastId, { render: "Erro ao excluir alimento!", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setIsConfirmModalOpen(false);
    setAlimentoToDeleteId(null);
  };

  const handleDelete = (id) => {
    setAlimentoToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nome: '', quantidade: '', unidade_de_medida: '' });
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>Controle de Alimentos</h1>
        <button onClick={openModal}>Adicionar Alimento</button>
      </div>

      <div className="alimento-list">
        {alimentos.length === 0 ? (
          <p className="no-alimentos-message">Nenhum alimento cadastrado ainda. Adicione um novo alimento!</p>
        ) : (
          alimentos.map((alimento) => (
            <div key={alimento.id} className="alimento-item">
              <div className="alimento-info">
                <span><strong>{alimento.nome}</strong></span>
                <span>{alimento.quantidade} {alimento.unidade_de_medida}</span>
              </div>
              <div className="alimento-actions">
                <button onClick={() => handleEdit(alimento)}>Editar</button>
                <button onClick={() => handleDelete(alimento.id)}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="modal-header-custom">
          <h2>{editingId ? 'Editar Alimento' : 'Adicionar Alimento'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="alimento-form">
          <input
            type="text"
            name="nome"
            placeholder="Nome do alimento"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="quantidade"
            placeholder="Quantidade"
            value={formData.quantidade}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="unidade_de_medida"
            placeholder="Unidade (ex: kg, L, un)"
            value={formData.unidade_de_medida}
            onChange={handleInputChange}
            required
          />
          <div className="form-buttons">
            <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
            <button type="button" onClick={closeModal}>Cancelar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isConfirmModalOpen} onClose={cancelDelete}>
        <div className="modal-body">
          <h2>Confirmar Exclusão</h2>
          <p>Tem certeza que deseja excluir este alimento?</p>
        </div>
        <div className="modal-footer">
          <button onClick={cancelDelete}>Cancelar</button>
          <button className="delete-recipe-btn" onClick={confirmDelete}>Excluir</button>
        </div>
      </Modal>
    </div>
  );
};

export default Alimentos;
