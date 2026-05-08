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
        Schema::table('quiz_rounds', function (Blueprint $table) {
            $table->json('revealed_letter_indices')->default('[]');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_rounds', function (Blueprint $table) {
            $table->dropColumn('revealed_letter_indices');
        });
    }
};
