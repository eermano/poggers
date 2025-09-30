import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Alimento {
    id: number;
    nome: string;
    quantidade: number;
    created_at: string; // Assuming created_at exists for sorting
}

interface WelcomeProps {
    alimentos: Alimento[];
}

export default function Welcome({ alimentos }: WelcomeProps) {
    const [showModal, setShowModal] = useState(false);
    const form = useForm({ nome: '', quantidade: 0, unidade_medida: '' });

    // Sort alimentos by created_at in descending order (most recent first)
    const sortedAlimentos = [...alimentos].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        form.setData(name as 'nome' | 'quantidade' | 'unidade_medida', value);
    };

    const handleSaveAlimento = () => {
        form.post('/api/alimentos', {
            onSuccess: () => {
                setShowModal(false);
                form.reset();
            },
            onError: (errors) => {
                console.error('Error saving alimento:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
                <h1 className="text-3xl font-bold text-red-500 mb-6">Lista de Alimentos</h1>

                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                        Novo Alimento
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="py-3 px-4 text-left text-red-400">ID</th>
                                <th className="py-3 px-4 text-left text-red-400">Nome</th>
                                <th className="py-3 px-4 text-left text-red-400">Quantidade</th>
                                <th className="py-3 px-4 text-left text-red-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAlimentos.map((alimento) => (
                                <tr key={alimento.id} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="py-3 px-4">{alimento.id}</td>
                                    <td className="py-3 px-4">{alimento.nome}</td>
                                    <td className="py-3 px-4">{alimento.quantidade}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                            Editar
                                        </button>
                                        <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-1/3 relative">
                            <h2 className="text-2xl font-bold text-red-500 mb-4">Adicionar Novo Alimento</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl"
                            >
                                &times;
                            </button>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="nome" className="block text-gray-300 text-sm font-bold mb-2">Nome:</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={form.data.nome}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="quantidade" className="block text-gray-300 text-sm font-bold mb-2">Quantidade:</label>
                                    <input
                                        type="number"
                                        id="quantidade"
                                        name="quantidade"
                                        value={form.data.quantidade}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-gray-100"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="unidade_medida" className="block text-gray-300 text-sm font-bold mb-2">Unidade de Medida:</label>
                                    <input
                                        type="text"
                                        id="unidade_medida"
                                        name="unidade_medida"
                                        value={form.data.unidade_medida}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-gray-100"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveAlimento}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
