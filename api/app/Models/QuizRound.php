<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizRound extends Model
{
    protected $fillable = [
        'pokemon_id',
        'hints_revealed',
        'status',
        'guess',
        'is_correct',
        'score',
        'completed_at',
    ];

    protected $casts = [
        'is_correct'   => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function pokemon(): BelongsTo
    {
        return $this->belongsTo(Pokemon::class);
    }
}
