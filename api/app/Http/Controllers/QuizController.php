<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use App\Models\QuizRound;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    private const MAX_HINTS = 4;
    private const SPRITE_URL_TEMPLATE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/%d.png';

    public function index(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 20), 1), 100);

        $rounds = QuizRound::with('pokemon')
            ->where('status', 'completed')
            ->latest('completed_at')
            ->limit($limit)
            ->get();

        return response()->json([
            'rounds' => $rounds->map(fn($round) => [
                'id' => $round->id,
                'pokemon_name' => $round->pokemon->name,
                'sprite_url' => sprintf(self::SPRITE_URL_TEMPLATE, $round->pokemon->id),
                'hints_used' => $round->hints_revealed,
                'score' => $round->score,
                'correct' => $round->is_correct,
                'completed_at' => $round->completed_at,
            ]),
        ]);
    }

    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'generations' => 'array',
            'generations.*' => 'integer|between:1,9',
        ]);

        $generations = $validated['generations'] ?? [];

        $pokemon = Pokemon::query()->when($generations, fn($q) => $q->whereIn('generation', $generations))->inRandomOrder()->firstOrFail();

        $round = QuizRound::create([
            'pokemon_id' => $pokemon->id,
        ]);

        return response()->json([
            'round_id' => $round->id,
            'sprite_url' => sprintf(self::SPRITE_URL_TEMPLATE, $pokemon->id),
            'max_hints' => self::MAX_HINTS,
        ]);
    }
    public function revealHint(QuizRound $round): JsonResponse
    {
        if ($round->status !== 'active') {
            return response()->json(['error' => 'Round already completed'], 422);
        }

        if ($round->hints_revealed >= self::MAX_HINTS) {
            return response()->json(['error' => 'No more hints available'], 422);
        }

        $round->increment('hints_revealed');
        $round->refresh();

        return response()->json([
            'hints_revealed' => $round->hints_revealed,
            'hint' => $this->buildHint($round->pokemon, $round->hints_revealed),
        ]);
    }

    public function submitAnswer(Request $request, QuizRound $round): JsonResponse
    {
        if ($round->status !== 'active') {
            return response()->json(['error' => 'Round already completed'], 422);
        }

        $validated = $request->validate([
            'guess' => 'required|string|max:100',
        ]);

        $guess = strtolower(trim($validated['guess']));

        $isCorrect = $guess === $round->pokemon->name;

        // Wrong guess but hints remain → auto-reveal a hint and keep playing
        if (! $isCorrect && $round->hints_revealed < self::MAX_HINTS) {
            $round->increment('hints_revealed');
            $round->refresh();

            return response()->json([
                'continued'      => true,
                'guess'          => $guess,
                'hints_revealed' => $round->hints_revealed,
                'hint'           => $this->buildHint($round->pokemon, $round->hints_revealed),
            ]);
        }

        // Round ends: either correct, or wrong with no hints left
        $score = $isCorrect
            ? max(20, 100 - ($round->hints_revealed * 20))
            : 0;

        $round->update([
            'guess'        => $guess,
            'is_correct'   => $isCorrect,
            'score'        => $score,
            'status'       => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json([
            'continued'  => false,
            'correct'    => $isCorrect,
            'name'       => $round->pokemon->name,
            'sprite_url' => sprintf(self::SPRITE_URL_TEMPLATE, $round->pokemon->id),
            'score'      => $score,
        ]);
    }

    private function buildHint(Pokemon $pokemon, int $hintNumber): array
    {
        return match ($hintNumber) {
            1 => ['kind' => 'type',       'value' => array_values(array_filter([$pokemon->primary_type, $pokemon->secondary_type]))],
            2 => ['kind' => 'generation', 'value' => $pokemon->generation],
            3 => ['kind' => 'stat_total', 'value' => $pokemon->stat_total],
            4 => ['kind' => 'abilities',  'value' => $pokemon->abilities],
        };
    }
}
