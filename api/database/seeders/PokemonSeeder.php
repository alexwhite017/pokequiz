<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pokemon;
use Illuminate\Support\Facades\Http;

class PokemonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pokemon::truncate();

        $lastGen1ID = 151;

        for($id = 1; $id <= $lastGen1ID; $id++) {
            $response = Http::get("https://pokeapi.co/api/v2/pokemon/{$id}");

            if ($response->failed()){
                $this->command->warn("Failed to fetch Pokemon #{$id}");
                continue;
            }

            $data = $response->json();

            $types = collect($data['types'])->sortBy('slot')->values();
            $abilities = collect($data['abilities'])->pluck('ability.name')->all();

            $statTotal = collect($data['stats'])->sum('base_stat');

            Pokemon::create([
                'name' => $data['name'],
                'primary_type' => $types[0]['type']['name'],
                'secondary_type' => $types[1]['type']['name'] ?? null,
                'generation' => 1,
                'stat_total' => $statTotal,
                'abilities' => $abilities,
            ]);

            $this->command->info("Seeded #{$id}: {$data['name']}");
        }
    }
}
