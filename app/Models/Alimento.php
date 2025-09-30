<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alimento extends Model
{
    protected $fillable = [
        'nome',
        'quantidade',
        'unidade_medida',
    ];
}
