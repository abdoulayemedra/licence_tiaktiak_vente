<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\LicenceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/getLicence', [LicenceController::class, 'getLicences'])->name('getLicense');
Route::post('/addLicence', [LicenceController::class, 'saveLicence'])->name('saveLicense');
Route::put('/updateLicence', [LicenceController::class, 'updateLicence'])->name('updateLicence');
Route::get('/deleteLicense', [LicenceController::class, 'updateLicence'])->name('deleteLicence');
Route::delete('/deleteLicense/{id}', [LicenceController::class, 'deleteLicence']);
Route::post('prolongementLicence', [LicenceController::class, 'prolongementLicence'])->name('prolongementLicence');
