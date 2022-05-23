<?php

namespace App\Http\Controllers;

use App\Models\Licence;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\Console\Input\Input;
use Yajra\DataTables\Facades\DataTables;

class LicenceController extends Controller
{
    public $validationRules = [
        'boutique_nom' => 'required|min:5',
        'boutique_uuid' => 'required|unique:licences|min:5',
        'date_fin' => 'required|date',
        'serveur_ip' => 'required|ipv4',
    ];

    public function getLicences(Request $request){
        if ($request->ajax()) {
            $page = $request->page;
            $resultCount = 10;
            $offset = ($page - 1) * $resultCount;

            $data = Licence::query();

//            $data = Bien::with(["proprietaire"])

            return Datatables::of($data)
                ->addIndexColumn()
                ->make(true);
        }
    }

    public function saveLicence(Request $request){
        $validator = Validator::make($request->all(), $this->validationRules);

        if ($validator->fails())
        {
            return Response::json(array(
                'success' => false,
                'errors' => $validator->getMessageBag()->toArray(),
                'old_value' => $request->all()
            ), 200); // 400 being the HTTP code for an invalid request.
        }

        $licence = new Licence($request->except( '_token'));
        $licence->save();
        return response()->json([
            'error' => false,
            'message'  => "Boutique enregistrée",
        ], 200);
    }

    public function updateLicence(Request $request){
        $id = $request->boutique_id;
//return $request;
        $this->validationRules['boutique_uuid'] = 'required|min:5|unique:licences,boutique_uuid,'.$id;
        $this->validationRules['date_fin'] = '';
        $validator = Validator::make($request->all(), $this->validationRules);
        if ($validator->fails())
        {
            return Response::json(array(
                'success' => false,
                'errors' => $validator->getMessageBag()->toArray(),
                'old_value' => $request->all()
            ), 200); // 400 being the HTTP code for an invalid request.
        }
        Licence::find($id)->update($request->only(['boutique_nom','boutique_uuid','serveur_ip']));
        return response()->json([
            'error' => false,
            'message'  => "Modification enregistrée",
        ], 200);
    }

    public function deleteLicence($licenceId){
        Licence::where("id",$licenceId)->delete();

        return response()->json([
            'error' => false,
            'message'  => "Licence Supprimée",
        ], 200);
    }

    public function prolongementLicence(Request $request){
        $type = $request->type;
        $boutiques = $request->boutiques;
        $licence = Licence::whereIn('id', $boutiques);
        switch ($type){
            case "add_week":
                $licence->update([
                    "date_fin"=>  DB::raw('DATE_ADD(coalesce(date_fin, now()), INTERVAL 1 WEEK)')
                ]);
                break;
            case "add_month":
                $licence->update([
                    "date_fin"=>  DB::raw('DATE_ADD(coalesce(date_fin, now()), INTERVAL 1 MONTH)')
                ]);
                break;
            case "add_day":
                $licence->update([
                    "date_fin"=>  DB::raw('DATE_ADD(coalesce(date_fin, now()), INTERVAL 1 DAY)')
                ]);
                break;
            case "add_by":
                $interval = $request->interval;
                $quantite = $request->quantite;
//                return $interval;
                switch ($interval){
                    case "Mois":
                        $licence->update([
                            "date_fin"=>  DB::raw('DATE_ADD(coalesce(date_fin, now()), INTERVAL '.$quantite.' MONTH)')
                        ]);
                        break;
                    Case "Jours":
                        $licence->update([
                            "date_fin"=>  DB::raw('DATE_ADD(coalesce(date_fin, now()), INTERVAL '.$quantite.' DAY)')
                        ]);
                        break;
                    Case "Semaines":
                        $licence->update([
                            "date_fin"=>  DB::raw('DATE_ADD(coalesce(date_fin, now()), INTERVAL '.$quantite.' WEEK)')
                        ]);
                        break;
                }
                break;
            case "set_at":
                $date  = $request->date;
                $licence->update([
                    "date_fin"=>  $date
                ]);
                break;
        }
    }
}
