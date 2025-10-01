<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alimento extends Model
{
    use HasFactory;

    protected $table = 'alimentos';

    protected $fillable = [
        'nome',
        'quantidade',
        'unidade_de_medida',
    ];
}
