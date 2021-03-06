$(function() {
    var table = $("#mega-table").DataTable({
        "processing": true,
        "ajax": {
            "url": "/jsons/index.json",
            "dataSrc": ""
        },
        "paging": false,
        "autoWidth": false,
        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
          $(nRow).addClass("main-row");
          return nRow;
        },
        "fixedHeader": true,
        "columns": [
            {
                "data": "МФО",
                "width": "7%",
                "render": function(data, type, row, meta) {
                    if (type == "display") {
                        if (row["Код банку"] != "-") {
                            return '<span data-toggle="tooltip" data-placement="bottom" title="Код банку: ' + row["Код банку"] + '">' + data + '</span>';
                        }
                    }
                    return data
                }
            },
            {
                "data": "Назва банку",
                "width": "35%"
            },
            {
                "data": "Адреса",
                "width": "30%"
            },
            {
                "data": "Філії",
                "defaultContent": "", 
                "width": "10%",
                "className": "text-right",
                "render": function(data, type, row, meta) {
                    if (type == "display") {
                        if (data != undefined) {
                            return '<span data-toggle="tooltip" data-placement="bottom" title="Станом на: ' + data["Дата"] + '">' + data["Кількість"] + '</span>';
                        }
                    }
                    
                    if (data != undefined) {
                        return data["Кількість"]
                    }
                }
            },
            {
                "data": "Структура власності",
                "defaultContent": "",
                "className": "text-center",
                "render": function(data, type, row, meta) {
                    if (type == "display") {
                        if (data != undefined) {
                            return '<a href="' + data["Посилання"] + '" target="_blank" title="Станом на: ' + data["Дата"] + '"><i class="glyphicon glyphicon-download-alt" /></span>';
                        }
                    }
                    return data
                }
            },
            {
                "className": 'details-control text-center',
                "orderable": false,
                "data": null,
                "width": "7%",
                "defaultContent": '<a href="#" class="details-link"><i class="glyphicon glyphicon-folder-open"></i></a>'
            }            
        ],

        "language": {
            "sProcessing":   "Зачекайте...",
            "sLengthMenu":   "Показати _MENU_ записів",
            "sZeroRecords":  "Записи відсутні.",
            "sInfo":         "Записи з _START_ по _END_ із _TOTAL_ записів",
            "sInfoEmpty":    "Записи з 0 по 0 із 0 записів",
            "sInfoFiltered": "(відфільтровано з _MAX_ записів)",
            "sInfoPostFix":  "",
            "sSearch":       "Пошук:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst": "Перша",
                "sPrevious": "Попередня",
                "sNext": "Наступна",
                "sLast": "Остання"
            },
            "oAria": {
                "sSortAscending":  ": активувати для сортування стовпців за зростанням",
                "sSortDescending": ": активувати для сортування стовпців за спаданням"
            }
        }
    }).on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip();
    }).on('click', 'a', function (e) {
        if (!$(this).hasClass("details-link")) {
            e.stopPropagation();
        }
    }).on('click', 'tr.main-row', function (e) {
        e.preventDefault();

        var tr = $(this).closest("tr");
        var row = table.row(tr);
 
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            $.get("/jsons/" + row.data()["Деталі"], function(data) {
                row.child(
                    nunjucks.render('templates/details.nunj', {"d": data}),
                    "details").show();
                tr.addClass('shown');
            });
        }
    });
});