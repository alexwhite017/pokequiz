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
        'revealed_letter_indices',
    ];

    protected $casts = [
        'is_correct'   => 'boolean',
        'completed_at' => 'datetime',
        'revealed_letter_indices' => 'array',
    ];

    public function pokemon(): BelongsTo
    {
        return $this->belongsTo(Pokemon::class);
    }
}
