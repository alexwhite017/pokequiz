<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_rounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pokemon_id')->constrained('pokemon');
            $table->unsignedTinyInteger('hints_revealed')->default(0);
            $table->string('status')->default('active');
            $table->string('guess')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->unsignedSmallInteger('score')->nullable();
            $table->timestamps();
            $table->timestamp('completed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_rounds');
    }
};
