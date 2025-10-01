<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlimentoController;
use App\Http\Controllers\ReceitaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('alimentos', AlimentoController::class);

Route::get('receitas/gerar', [ReceitaController::class, 'gerar']);
Route::get('receitas', [ReceitaController::class, 'index']);
Route::post('receitas', [ReceitaController::class, 'store']);
Route::delete('receitas/{receita}', [ReceitaController::class, 'destroy']);