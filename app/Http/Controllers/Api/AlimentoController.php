<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alimento;
use Illuminate\Http\Request;

class AlimentoController extends Controller
{
    public function index()
    {
        return Alimento::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string',
            'quantidade' => 'required|integer',
            'unidade_medida' => 'required|string',
        ]);

        $alimento = Alimento::create($request->all());

        return redirect()->route('home');
    }

    /**
     * Display the specified resource.
     */
    public function show(Alimento $alimento)
    {
        return $alimento;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alimento $alimento)
    {
        $request->validate([
            'nome' => 'string',
            'quantidade' => 'integer',
            'unidade_medida' => 'string',
        ]);

        $alimento->update($request->all());

        return response()->json($alimento, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alimento $alimento)
    {
        $alimento->delete();

        return response()->json(null, 204);
    }
}
