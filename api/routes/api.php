<?php

use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;

Route::prefix('quiz')->group(function () {
    Route::get('/rounds', [QuizController::class, 'index']);
    Route::get('/pokemon', [QuizController::class, 'pokemon']);
    Route::post('/rounds', [QuizController::class, 'start']);
    Route::post('/rounds/{round}/hints', [QuizController::class, 'revealHint']);
    Route::post('/rounds/{round}/answer', [QuizController::class, 'submitAnswer']);

});
