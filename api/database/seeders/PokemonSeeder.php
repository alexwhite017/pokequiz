<?php

namespace Database\Seeders;


use Illuminate\Support\Facades\Schema;
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

        Schema::disableForeignKeyConstraints();
        Pokemon::truncate();
        Schema::enableForeignKeyConstraints();

        $maxId = 1025;

        for ($id = 1; $id <= $maxId; $id++) {
            $response = Http::get("https://pokeapi.co/api/v2/pokemon/{$id}");

            if ($response->failed()) {
                $this->command->warn("Failed to fetch Pokémon #{$id}");
                continue;
            }

            $data = $response->json();

            $types = collect($data['types'])->sortBy('slot')->values();
            $abilities = collect($data['abilities'])->pluck('ability.name')->all();
            $statTotal = collect($data['stats'])->sum('base_stat');

            Pokemon::create([
                'name'           => $data['species']['name'],
                'primary_type'   => $types[0]['type']['name'],
                'secondary_type' => $types[1]['type']['name'] ?? null,
                'generation'     => $this->generationForId($id),
                'stat_total'     => $statTotal,
                'abilities'      => $abilities,
            ]);


            $this->command->info("Seeded #{$id}: {$data['species']['name']}");
        }
    }
    private function generationForId(int $id): int
    {
        return match (true) {
            $id <= 151  => 1,
            $id <= 251  => 2,
            $id <= 386  => 3,
            $id <= 493  => 4,
            $id <= 649  => 5,
            $id <= 721  => 6,
            $id <= 809  => 7,
            $id <= 905  => 8,
            default     => 9,
        };
    }
}
