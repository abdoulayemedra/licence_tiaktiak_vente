@extends('layouts.app')
@section('head')
    <style>
        .ligne_type_ajout{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .ligne_type_ajout button{
            flex: none;
        }
    </style>
@endsection
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}
                    <button class="btn btn-primary" onclick="ajouterBoutique()">Ajouter boutique</button>
                    <button class="btn btn-secondary" onclick="refreshDataTable()">Actualiser</button>
                </div>

                <div class="card-body">
                    <div class="card-body table-responsive ">
                        <table class="table table-bordered table-striped dataTable data-table " id="datatable">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Nom</th>
                                    <th>UUID</th>
                                    <th>Etat</th>
                                    <th>Adresse IP</th>
                                    <th width="200px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('script')
    <script>
        var creationBoutique = "{{route("saveLicense")}}";
        var modificationBoutique = "{{route("updateLicence")}}";
        var suppressionLicence = "{{route("deleteLicence")}}";
        var prolongementLicence = "{{route("prolongementLicence")}}";
        var csrfTocken = "{{ csrf_token() }}"
        {{--var csrfTocken = "@csrf"--}}
        $( document ).ready(function() {
            // console.log($("#datatable").DataTable());
                // .dataTable();
            initDataTable("#datatable", "{{route("getLicense")}}");
        });
    </script>
    @endsection
