import "datatables.net-bs4"


var additionnalActionButtons = undefined;
var showViewButton = true;
var showEditButton = true;
var showDeleteButton = true;
var elementToDelete = undefined;
var deleteNameArray = [];

var beforeDefaultButtton = false;

export function setadditionnalActionButtons(value, beforeDefautButtonValue) {
    additionnalActionButtons = value;
    beforeDefaultButtton = beforeDefautButtonValue??false;

}
export function setShowViewButton(value) {
    showViewButton = value;
}
export function setShowEditButton(value) {
    showEditButton = value;
}

export function setShowDeleteButton(value) {
    showDeleteButton = value;
}

export function setDeleteNameArray(value) {
    deleteNameArray = value;
}

export function getElementToDelete() {
    return elementToDelete;
}


export var actionButton = {data: 'action', render: function (data, type, row) {
        var el = '<i style="display: none" id="'+row.id+'"></i>';
        // console.log(data)
        if (additionnalActionButtons!=undefined && beforeDefaultButtton)
            el+=additionnalActionButtons;

        var entityName = "";
        deleteNameArray.forEach(function (n) {
            // console.log(row)
            //     var no = row[n];
            if (row[n] !== undefined)
                entityName+=" "+row[n];
        });
        // data.delete = escape(data.delete)
        // data.edit = escape(data.edit)
        var deleteUrl = data.delete;
        if (showViewButton)
            el+='<a type="button" class="btn btn-success ml-1 p-1" href="'+data.view+'">\n' +
                '                          <i class="fas fa-eye"></i>\n' +
                '                        </a>';

        if (showEditButton)
            el+='<a type="button" class="btn btn-primary ml-1 p-1" href="'+data.edit+'">\n' +
                '                          <i class="fas fa-edit"></i>\n' +
                '                        </a>';

        if (showDeleteButton){
            elementToDelete = row;
            el+='<a type="button" onclick="deleteEl(\''+entityName+'\',\''+deleteUrl+'\')" class="btn btn-danger ml-1 p-1" href="#">\n' +
                '                          <i class="fas fa-trash"></i>\n' +
                '                        </a>';
        }


        if (additionnalActionButtons!=undefined && !beforeDefaultButtton)
            el+=additionnalActionButtons;

        return el;
        // return '<span class="badge badge-info right">'+antiteList[data]+'</span>'
    }}

export function initDataTable(element, ajaxUrl, column, order) {
    var table  = $(element).DataTable({
        processing: true,
        searchDelay: 200,
        ing: true,
        serverSide: true,
        order: order,
        ajax: ajaxUrl,
        columns: column,
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
