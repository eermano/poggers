<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\AlimentoController;

Route::get('/', function () {
    $alimentos = (new AlimentoController())->index();
    return Inertia::render('welcome', ['alimentos' => $alimentos]);
})->name('home');
