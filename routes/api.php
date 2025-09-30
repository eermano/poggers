<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AlimentoController;

Route::apiResource('alimentos', AlimentoController::class);
