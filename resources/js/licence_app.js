
window.$ = window.jQuery = require('jquery');

import "datatables.net-bs4"

var table;

window.ajouterBoutique =  function (errorData){
    console.log(errorData);
    var htmlRendu = "";
    var UUID = genererUUID();
    // console.log("debugging UUID");
    // console.log(UUID);
    // console.log("debugging UUID");
    // console.log(UUID);
    if (errorData != undefined){
        var erreur = errorData.errors;
        var oldValue = errorData.oldValue;

        // console.log(erreur);
        htmlRendu ='<form>' +
        '  <div class="form-group">' +
        '    <label for="nom">Nom</label>';
            if(erreur['boutique_nom']!==undefined){
                htmlRendu+='<input value="'+oldValue['boutique_nom']+'" name="boutique_nom" type="text" class="form-control is-invalid" id="nom" aria-describedby="emailHelp" placeholder="Enter nom boutique">'+
                '<small id="passwordHelp" class="text-danger">'+ erreur['boutique_nom'] +'</small>'
            }else
                htmlRendu+='<input value="'+oldValue['boutique_nom']+'" name="boutique_nom" type="text" class="form-control" id="nom" aria-describedby="emailHelp" placeholder="Enter nom boutique">'

        htmlRendu +='  </div>' +
        '  <div class="form-group">' +
        '    <label for="uuid">UUID</label>';


        if(erreur['boutique_uuid']!==undefined){
            htmlRendu+='<input value="'+oldValue['boutique_uuid']+'" name="boutique_uuid" type="text" class="form-control is-invalid" id="boutique_uuid" aria-describedby="emailHelp" placeholder="Identifiant unique boutique">'+
                '<small id="passwordHelp" class="text-danger">'+ erreur['boutique_uuid'] +'</small>';
        }else
            htmlRendu+='<input value="'+oldValue['boutique_uuid']+'" name="boutique_uuid" type="text" class="form-control" id="boutique_uuid" aria-describedby="emailHelp" placeholder="Identifiant unique boutique">';

        htmlRendu+='  </div>' +
        '  <div class="form-group">' +
        '    <label for="ip">IP</label>';
        if(erreur['serveur_ip']!==undefined){
            htmlRendu+='<input name="serveur_ip" value="'+oldValue['serveur_ip']+'" type="text" class="form-control" id="serveur_ip" placeholder="IP">' +
                '<small id="passwordHelp" class="text-danger">'+ erreur['serveur_ip'] +'</small>';
        }else
            htmlRendu+='<input name="serveur_ip" value="'+oldValue['serveur_ip']+'" type="text" class="form-control" id="serveur_ip" placeholder="IP">'

        htmlRendu+='  </div>' +
        '  <div class="form-group">' +
        '    <label for="endDate">date Fin licence</label>';
        if(erreur['date_fin']!==undefined) {
            htmlRendu += '    <input name="date_fin" type="date" class="form-control" id="endDate" placeholder="Date fin">' +
                '<small id="passwordHelp" class="text-danger">' + erreur['date_fin'] + '</small>';
        }else
            htmlRendu += '    <input name="date_fin" type="date" class="form-control" id="endDate" placeholder="Date fin">';
        htmlRendu += '  </div>' +
        '</form>';
    }else {
        htmlRendu = '<form>' +
        '  <div class="form-group">' +
        '    <label for="nom">Nom</label>' +
        '    <input name="boutique_nom" type="text" class="form-control" id="nom" aria-describedby="emailHelp" placeholder="Enter nom boutique">' +
        '  </div>' +
        '  <div class="form-group">' +
        '    <label for="uuid">UUID</label>' +
        '    <input name="boutique_uuid" value="'+UUID+'" type="text" class="form-control" id="boutique_uuid" placeholder="Identifiant unique boutique">' +
        '  </div>' +
        '  <div class="form-group">' +
        '    <label for="ip">IP</label>' +
        '    <input name="serveur_ip" type="text" class="form-control" id="serveur_ip" placeholder="IP">' +
        '  </div>' +
        '  <div class="form-group">' +
        '    <label for="date_fin">date Fin licence</label>' +
        '    <input name="date_fin" type="date" class="form-control" id="endDate" placeholder="Date fin">' +
        '  </div>' +
        '</form>';
    }
    Swal.fire({
        title: 'Ajout Boutique',
        // icon: 'info',
        html: htmlRendu,

        // showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Ajouter',
        cancelButtonText:
            'Annuler'
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            enregistrerBoutique();
        }
    })
}
window.genererUUID = function (){
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

function afficherErreur(erreurs, oldValue) {
    console.log(oldValue)
}
window.selectedBoutique = [];
function enregistrerBoutique(){
    var boutique_nom= $('#nom').val();
    var boutique_uid= $('#boutique_uuid').val();
    var date_fin= $('#endDate').val();
    var serveur_ip= $('#serveur_ip').val();

    var data = {
        _token: csrfTocken,
        boutique_nom: boutique_nom,
        boutique_uuid: boutique_uid,
        date_fin: date_fin,
        serveur_ip: serveur_ip,
    }
    Swal.fire({
        title: 'Enregistrement en cours...',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    // console.log(commande);
    $.ajax({
        type: "POST",
        url: creationBoutique,
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (response) {
            console.log(response)
            if (response.error){
                ajouterBoutique({errors:response.errors, oldValue:response.old_value});
            }else{
                refreshDataTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Boutique enregistrer !',confirmButtonColor: '#d67d1b',
                    confirmButtonText: 'OK',
                })
            }
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "erreur lors de l'enregistrement de la boutique!",
            })
        }
    });
}

var boutiques = {};
window.initDataTable = function (element, ajaxUrl) {
     table  = $(element).DataTable({
        processing: true,
        searchDelay: 200,
        ing: true,
        serverSide: true,
        // order: order,
        ajax: ajaxUrl,
        columns: [
            {data: 'id', name: 'id', orderable: true, searchable: true},
            {data: 'boutique_nom', name: 'boutique_nom'},
            {data: 'boutique_uuid', name: 'boutique_uuid'},
            {data: 'date_fin', name: 'date_fin', render: function (data, type, row) {
                var now = moment();
                var endDate = moment(data, "YYYY-MM-DD");
                var differenceDeJour = moment.duration(endDate.diff(now)).asDays();
                differenceDeJour =  Math.round(differenceDeJour);
                var info = "";
                if (differenceDeJour>0){
                    var badge = 'badge-primary';
                    if (differenceDeJour  < 5)
                        badge = 'badge-warning';
                    else if (differenceDeJour < 20)
                        badge = 'badge-success';
                    info +=  '<span class="badge '+badge+'">Active <br> Reste : '+differenceDeJour+'  Jour(s)</span>';
                }else {
                    info +=  '<span class="badge badge-danger">Expirée<br> Depuis : '+Math.abs(differenceDeJour)+'  Jour(s)</span>';
                }

                if (row.date_synchronisation == null) {
                    info +=  '<span class="badge badge-danger">Jamais synchronisé</span>';
                }else {
                    var date_synchro = moment(row.date_synchronisation);
                    var dateDernierModification = moment(row.updated_at);
                    var differenceDeJourSynchro = moment.duration(date_synchro.diff(dateDernierModification)).asDays();
                    differenceDeJourSynchro = Math.round(differenceDeJourSynchro);
                    // console.log(differenceDeJourSynchro);
                    if (differenceDeJourSynchro>=0){
                        info +=  '<br> <span class="badge badge-success">Synchronisé <br> il y a : '+differenceDeJourSynchro+'  Jour(s)</span>';
                    }else {
                        info +=  '<br> <span class="badge badge-warning">Non synchronisé <br> Depuis  : '+Math.abs(differenceDeJourSynchro)+' Jour(s)</span>';
                    }
                }
                // console.log(row.date_synchronisation!=null);


                    return info;
            }},
            {data: 'serveur_ip', name: 'serveur_ip'},
            {data: 'action', name: 'action', orderable: true, searchable: true, render: function (data, type, row) {

                boutiques[row.id] = row;
                // var boutiqueJson = JSON.stringify(row);
                // console.log(row)
                    var action = "";
                action += '<button onclick="prolongerLicence(\''+row.id+'\')"  type="button" class="btn btn-outline-success m-1"><i class="fas fa-calendar-plus"></i></button>';
                action += '<button onclick="modifierBoutique(undefined, '+row.id+')"  type="button" class="btn btn-outline-primary m-1"><i class="fas fa-edit"></i></button>';
                action += '<button onclick="supprimerBoutique(\''+row.boutique_nom+'\', '+row.id+')"  type="button" class="btn btn-outline-danger m-1"><i class="fas fa-trash"></i></button>';
                    // '<button onclick=\'modifierBoutique("'+boutiqueJson+'")\' type="button" class="btn btn-outline-success m-1"><i class="fas fa-edit"></i></button>' +
                    // '<button onclick=\'modifierBoutique("'+boutiqueJson+'")\'  type="button" class="btn btn-outline-danger m-1"><i class="fas fa-sync"></i></button>';
                    // '<button type="button" class="btn btn-outline-warning m-1"><i class="fas fa-plus"></i></button>';
                return action;
            }},
        ],
        language: {
            "sEmptyTable":     "Aucune donnée disponible",
            "sInfo":           "Affichage de l'élément _START_ à _END_ sur _TOTAL_ éléments",
            "sInfoEmpty":      "Affichage de l'élément 0 à 0 sur 0 élément",
            "sInfoFiltered":   "(filtré à partir de _MAX_ éléments au total)",
            "sInfoPostFix":    "",
            "sInfoThousands":  ",",
            "sLengthMenu":     "Afficher _MENU_ éléments",
            "sLoadingRecords": "Chargement...",
            "sProcessing":     "Traitement...",
            "sSearch":         "Rechercher :",
            "sZeroRecords":    "Aucun élément correspondant trouvé",
            "oPaginate": {
                "sFirst":    "Premier",
                "sLast":     "Dernier",
                "sNext":     "Suivant",
                "sPrevious": "Précédent"
            },
            "oAria": {
                "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
                "sSortDescending": ": activer pour trier la colonne par ordre décroissant"
            },
            "select": {
                "rows": {
                    "_": "%d lignes sélectionnées",
                    "0": "Aucune ligne sélectionnée",
                    "1": "1 ligne sélectionnée"
                }
            }
        },
    });
    return table;
}

window.modifierBoutique =  function (errorData, boutiqueID){
    console.log(errorData);
    var htmlRendu = "";
    if (errorData != undefined){
        var erreur = errorData.errors;
        var oldValue = errorData.oldValue;
        console.log(oldValue);
        // console.log(erreur);
        htmlRendu ='<form>' +
            '  <div class="form-group">' +
            '    <label for="nom">Nom</label>';
        if(erreur['boutique_nom']!==undefined){
            htmlRendu+='<input value="'+oldValue['boutique_nom']+'" name="boutique_nom" type="text" class="form-control is-invalid" id="nom" aria-describedby="emailHelp" placeholder="Enter nom boutique">'+
                '<small id="passwordHelp" class="text-danger">'+ erreur['boutique_nom'] +'</small>'
        }else
            htmlRendu+='<input value="'+oldValue['boutique_nom']+'" name="boutique_nom" type="text" class="form-control" id="nom" aria-describedby="emailHelp" placeholder="Enter nom boutique">'

        htmlRendu +='  </div>' +
            '  <div class="form-group">' +
            '    <label for="uuid">UUID</label>';

        if(erreur['boutique_uuid']!==undefined){
            htmlRendu+='<input value="'+oldValue['boutique_uuid']+'" name="boutique_uuid" type="text" class="form-control is-invalid" id="boutique_uuid" aria-describedby="emailHelp" placeholder="Identifiant unique boutique">'+
                '<small id="passwordHelp" class="text-danger">'+ erreur['boutique_uuid'] +'</small>';
        }else
            htmlRendu+='<input value="'+oldValue['boutique_uuid']+'" name="boutique_uuid" type="text" class="form-control" id="boutique_uuid" aria-describedby="emailHelp" placeholder="Identifiant unique boutique">';

        htmlRendu+='  </div>' +
            '  <div class="form-group">' +
            '    <label for="ip">IP</label>';
        if(erreur['serveur_ip']!==undefined){
            htmlRendu+='<input name="serveur_ip" value="'+oldValue['serveur_ip']+'" type="text" class="form-control" id="serveur_ip" placeholder="IP">' +
                '<small id="passwordHelp" class="text-danger">'+ erreur['serveur_ip'] +'</small>';
        }else
            htmlRendu+='<input name="serveur_ip" value="'+oldValue['serveur_ip']+'" type="text" class="form-control" id="serveur_ip" placeholder="IP">'

        // htmlRendu+='  </div>' +
        //     '  <div class="form-group">' +
        //     '    <label for="endDate">date Fin licence</label>';

        htmlRendu += '  </div>' +
            '</form>';
    }else {
        var boutique = boutiques[boutiqueID]
        htmlRendu = '<form>' +
            '  <div class="form-group">' +
            '    <label for="nom">Nom</label>' +
            '    <input value="'+boutique.boutique_nom+'" name="boutique_nom" type="text" class="form-control" id="nom" aria-describedby="emailHelp" placeholder="Enter nom boutique">' +
            '  </div>' +
            '  <div class="form-group">' +
            '    <label for="uuid">UUID</label>' +
            '    <input value="'+boutique.boutique_uuid+'" name="boutique_uuid" type="text" class="form-control" id="boutique_uuid" placeholder="Identifiant unique boutique">' +
            '  </div>' +
            '  <div class="form-group">' +
            '    <label for="ip">IP</label>' +
            '    <input value="'+boutique.serveur_ip+'" name="serveur_ip" type="text" class="form-control" id="serveur_ip" placeholder="IP">' +
            '  </div>' +
            '</form>';
    }
    Swal.fire({
        title: 'Modification Boutique',
        html: htmlRendu,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Enregistrer',
        cancelButtonText:
            'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            enregistrerModification(boutiqueID);
        }
    })
}

window.supprimerBoutique = function(boutiqueNom, boutiqueId){
    // console.log("Debugging supression article")
    // console.log(boutiqueId)
    // console.log(boutiqueNom)
    Swal.fire({
        title: 'Etes vous sure?',
        html: 'Voulez vous vraient supprimer la boutique <br><b>'+boutiqueNom+'</b>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d67d1b',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Suppression en cours...',
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            var data = {
                _token: csrfTocken,
            }
            $.ajax({
                type: "DELETE",
                url: suppressionLicence+"/"+boutiqueId,
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                success: function (response) {
                    console.log(response);
                    if (!response.error){
                        refreshDataTable();
                        Swal.fire({
                            icon: 'success',
                            title: 'Licence supprimé avec succès',
                            confirmButtonColor: '#d67d1b',
                            confirmButtonText: 'OK',
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur l\'erreur lors de la supression de la licence',
                            confirmButtonColor: '#d67d1b',
                            confirmButtonText: 'OK',
                        })
                    }
                },
                error: function (error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "erreur lors de la modification de la boutique",
                    })
                }
            });
        }
    })
}

window.prolongerLicence = function (boutique_id) {
    window.selectedBoutique = [boutique_id];
    Swal.fire({
        title: 'Prolongement Licence',
        // icon: 'info',
        html:

                '<div class="ligne_type_ajout">'+
                    '<button class="btn btn-secondary" onclick="enregistrerProlongement(\'add_week\')">Ajouter Semaine</button>' +
                    '<button class="btn btn-success" onclick="enregistrerProlongement(\'add_month\')">Ajouter Mois</button>' +
                    '<button class="btn btn-primary" onclick="enregistrerProlongement(\'add_day\')">Ajouter Jour</button>' +
                '</div>' +
                '<div class="ligne_type_ajout">' +
                    '<input class="form-control " name="input_ajout_nombre" type="number" value="1" id="input_ajout_nombre">' +
                    '<select class="form-control" name="select_intervale_ajout" id="select_intervale_ajout">' +
                        '<option value="mois">Mois</option>\n' +
                        '<option value="jour">Jours</option>\n' +
                        '<option value="semaine">Semaines</option>\n' +
                    '</select>' +
                    '<button class="btn btn-primary" onclick="enregistrerProlongement(\'add_by\')">Ajouter</button>' +
                '</div>' +
                '<div class="ligne_type_ajout">' +
                    '<input class="form-control " name="input_ajout_precis" type="date" value="1" id="input_date">' +
                    '<button class="btn btn-primary" onclick="enregistrerProlongement(\'set_at\')">Ajouter</button>' +
                '</div>' ,
        confirmButtonText:'Annuler',
    })
}

window.enregistrerProlongement = function(type){
    var data = {
        _token: csrfTocken,
        type: type,
        boutiques: window.selectedBoutique,
    }
    switch (type) {
        case "add_by":
            var quantite = $('#input_ajout_nombre').val();
            var interval = $('#select_intervale_ajout').find(":selected").text();
            data["quantite"] = quantite;
            data["interval"] = interval;
            break;
        case "set_at":
            data["date"] = $('#input_date').val();
            break;
    }
    // console.log(data);

    Swal.fire({
        title: 'Ajout licence en cours...',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    // console.log(commande);
    $.ajax({
        type: "POST",
        url: prolongementLicence,
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (response) {
            if (!response.error){
                refreshDataTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Nouvelle licence enregistrée !',
                    confirmButtonColor: '#d67d1b',
                    confirmButtonText: 'OK',
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "erreur lors de la modification de la boutique",
                })
            }
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "erreur lors de la modification de la boutique",
            })
        }
    });
}

function enregistrerModification(boutiqueID){
    var boutique_id= boutiqueID;
    var boutique_nom= $('#nom').val();
    var boutique_uid= $('#boutique_uuid').val();
    var date_fin= $('#endDate').val();
    var serveur_ip= $('#serveur_ip').val();

    var data = {
        _token: csrfTocken,
        boutique_id: boutique_id,
        boutique_nom: boutique_nom,
        boutique_uuid: boutique_uid,
        date_fin: date_fin,
        serveur_ip: serveur_ip,
    }
    Swal.fire({
        title: 'Enregistrement en cours...',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    // console.log(commande);
    $.ajax({
        type: "PUT",
        url: modificationBoutique,
        data: data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (response) {
            // console.log(response.old_value)
            if (!response.error){
                refreshDataTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Modification enregistrer !',
                    confirmButtonColor: '#d67d1b',
                    confirmButtonText: 'OK',
                })
            }else{
                modifierBoutique({errors:response.errors, oldValue:response.old_value}, boutiqueID);
            }
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "erreur lors de la modification de la boutique",
            })
        }
    });
}

window.refreshDataTable = function () {
    table.ajax.reload();
}
