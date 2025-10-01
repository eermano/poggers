<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alimento;
use App\Models\Receita;
use Illuminate\Support\Facades\Http;

// Controlador responsável por operações relacionadas a receitas
class ReceitaController extends Controller
{
    /**
     * Gera uma receita usando a API Hugging Face com base nos ingredientes cadastrados.
     * Se não houver ingredientes, redireciona para o cadastro de alimentos.
     */

    public function gerar(Request $request)
    {
        // Busca todos os ingredientes cadastrados
        $alimentos = Alimento::all();

        // Se não houver ingredientes, retorna um erro
        if ($alimentos->isEmpty()) {
            return response()->json(['error' => 'Ops! Você precisa cadastrar alguns ingredientes antes de criar uma receita.'], 400);
        }

        // Monta a lista de ingredientes para o prompt
        $lista = $alimentos->map(function ($a) {
            return $a->nome . ' (' . $a->quantidade . ' ' . $a->unidade_medida . ')';
        })->implode(", ");

        // Prompt instruindo a IA a retornar APENAS o conteúdo Markdown com o título incluído
        $prompt = "Você é um chef de cozinha criativo. Sua tarefa é criar uma receita detalhada e saborosa usando apenas os ingredientes fornecidos: $lista. Sua resposta DEVE ser APENAS o conteúdo da receita em formato Markdown. Comece a receita com o título como um cabeçalho de nível 1 (ex: '# Título da Receita'), seguido pelo restante do conteúdo (ingredientes, modo de preparo). Não inclua nenhum outro texto ou formatação além do Markdown da receita.";

        // Configurações do modelo e da API
        $model = 'meta-llama/Llama-3.1-8B-Instruct';
        $apiToken = env('HUGGINGFACE_API_TOKEN');
        $url = 'https://router.huggingface.co/v1/chat/completions';
        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 2048,
            'temperature' => 0.75,
        ];

        // Faz a requisição para a API do Hugging Face
        $response = Http::withToken($apiToken)
            ->timeout(60)
            ->post($url, $payload);

        if ($response->failed()) {
            \Log::error('Hugging Face API request failed: ' . $response->body());
            throw new \Exception('Falha ao solicitar receita à API: ' . $response->body());
        }

        // Extrai o conteúdo da resposta da IA
        $rawContent = $response->json('choices.0.message.content', '');

        // Limpa o conteúdo de possíveis marcações de código (```json, ```) que a IA possa ter inserido
        $cleanedMarkdownContent = trim(str_replace(['```json', '```'], '', $rawContent));
        
        // Retorna apenas o conteúdo Markdown. O título deve estar dentro do Markdown.
        return response($cleanedMarkdownContent, 200)
                    ->header('Content-Type', 'text/markdown');
    }

    /**
     * Lista todas as receitas salvas, ordenadas da mais recente para a mais antiga.
     */
    public function index()
    {
    // Busca todas as receitas do banco
        $receitas = Receita::orderByDesc('created_at')->get();
        return response()->json($receitas);
    }

    /**
     * Salva uma nova receita no banco de dados.
     */
    public function store(Request $request)
    {
    // Cria a receita com os dados do formulário
        $receita = Receita::create([
            'titulo' => $request->input('titulo', 'Receita Gerada'),
            'conteudo' => $request->input('conteudo'),
        ]);
        return response()->json($receita, 201);
    }

    /**
     * Exclui uma receita do banco de dados.
     */
    public function destroy(Receita $receita)
    {
    // Remove a receita selecionada
        $receita->delete();
        return response()->json(null, 204);
    }
}
