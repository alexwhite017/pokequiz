<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    protected $table = 'pokemon';

    protected $fillable = [
        'name',
        'primary_type',
        'secondary_type',
        'generation',
        'stat_total',
        'abilities',
    ];

    protected $casts = [
        'abilities' => 'array',
    ];
}
