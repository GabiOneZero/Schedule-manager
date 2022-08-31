function volver() {
    $.ajax({
        url: DIR_SERV + '/logueado',
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.usuario) {
                $("#respuesta").html("");
            }
            else if (data.error) {
                cargar_vista_error(data.error);
            }
            else {
                saltar_a("index.html")
            }

        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });

}

function editar(cod) {
    $.ajax({
        url: encodeURI(DIR_SERV + '/producto/' + cod),
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.producto) {
                montar_form_editar(data.producto);
            }
            else if (data.mensaje) {
                $('#respuesta').html(data.mensaje);
            }
            else {
                cargar_vista_error(data.error);
            }

        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });


}
function listar(cod) {
    $.ajax({
        url: encodeURI(DIR_SERV + '/producto/' + cod),
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {
            if (data.no_auth) {
                saltar_a("index.html");
            }
            else if (data.producto) {
                var output = "<h2>Detalles del producto " + cod + "</h2>";
                if (data.producto["nombre"])
                    output += "<p><strong>Nombre: </strong>" + data.producto["nombre"] + "</p>";
                else
                    output += "<p><strong>Nombre: </strong></p>";

                output += "<p><strong>Nombre corto: </strong>" + data.producto["nombre_corto"] + "</p>";
                output += "<p><strong>Descripción: </strong>" + data.producto["descripcion"] + "</p>";
                output += "<p><strong>PVP: </strong>" + data.producto["PVP"] + " €</p>";
                output += "<p><strong>Familia: </strong>" + data.producto["nombre_familia"] + "</p>";
                output += "<p><button onclick='volver()';>Volver</button></p>";
                $('#respuesta').html(output);
            }
            else if (data.mensaje) {
                $('#respuesta').html(data.mensaje);
            }
            else {
                cargar_vista_error(data.error);
            }
        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });
}

function continuar_borrar(dia, hora, id_profesor, id_grupo) {
    $.ajax({
        url: encodeURI(DIR_SERV + "/borrarGrupo/" + dia + "/" + hora + "/" + id_profesor + "/" + id_grupo),
        type: "DELETE",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                saltar_a("index.html");
            }
            else if (data.mensaje) {
                $('#respuesta').html(data.mensaje);
                pasar_valor_submit()
                mostrar_grupos(dia, hora, id_profesor)
            }
            else {
                cargar_vista_error(data.error);
            }

        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });
}

function borrar(dia, hora, id_profesor, id_grupo) {
    $.ajax({
        url: DIR_SERV + '/logueado',
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.usuario) {
                var html_code = "<h2 class='centrar'>Confirmación de borrado del grupo " + id_grupo + "</h2>";
                html_code += "<p class='centrar'>¿Estás seguro de que desea borrar el grupo " + id_grupo + "?</p>";
                html_code += "<p class='centrar'><button onclick='cerrar_modal();'>Cancelar</button> <button onclick='continuar_borrar(" + dia + "," + hora + "," + id_profesor + "," + id_grupo + ");cerrar_modal();'>Aceptar</button></p>";

                abrir_modal(html_code);
            }
            else if (data.error) {
                cargar_vista_error(data.error);
            }
            else {
                saltar_a("index.html")
            }

        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });

}


function obtener_horario_normal(id, nombre) {
    $.ajax({
        url: encodeURI(DIR_SERV + "/horario/" + id),
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                saltar_a("index.html");
            } else if (data.horario) {
                let output = "";
                output += "<h3>Su horario</h3>"
                output += "<h4 class='centrar'>Horario del Profesor:" + nombre + "</h4>"
                output += "<div class='responsive_table'>"
                output += "<table class='centrar'>"
                output += "<tr>"
                output += "<th></th>"
                output += "<th>Lunes</th>"
                output += "<th>Martes</th>"
                output += "<th>Miércoles</th>"
                output += "<th>Jueves</th>"
                output += "<th>Viernes</th>"
                output += "</tr>"

                let horas = [];
                horas[1] = "8:15-9:15";
                horas[2] = "9:15-10:15";
                horas[3] = "10:15-11:15";
                horas[4] = "10:15-11:45";
                horas[5] = "11:45-12:45";
                horas[6] = "12:45-13:45";
                horas[7] = "13:45-14:45";

                let datos_horario = [];
                let arrayDatos = Object.entries(data.horario);

                arrayDatos.forEach((element, index) => {
                    datos_horario[index] = element;
                });

                for (let i = 1; i <= 7; i++) {
                    output += "<tr>";
                    output += "<th>" + horas[i] + "</th>";
                    if (i == 4) {
                        output += "<td colspan=5>RECREO</td>";
                    } else {
                        for (let j = 1; j <= 5; j++) {
                            output += "<td>";
                            let relleno = false;
                            let aula = "";
                            datos_horario.forEach((element) => {
                                console.log("elemento")
                                console.log(element)
                                if (element[1].hora == i && element[1].dia == j) {

                                    if (relleno) {
                                        output = output.slice(0, -9)
                                        output += " / " + element[1].nombre_grupo;
                                        output += "<br>(" + element[1].nombre_aula + ")";

                                    } else {
                                        output += element[1].nombre_grupo + " ";
                                        if (element[1].aula != AULA_VACIA) {
                                            output += "<br>(" + element[1].nombre_aula + ")";
                                        }
                                        
                                        relleno = true;
                                    }

                                }

                            });
                            output += "</td>";
                        }
                    }
                    output += "</tr>";
                }

                output += "</table>"
                output += "</div>"
                $('#horario').html(output);
            } else {
                cargar_vista_error(data.error);
            }
        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });

}

function obtener_select_profesores() {
    $.ajax({
        url: DIR_SERV + "/usuarios",
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                saltar_a("index.html");
            }
            else if (data.usuarios) {

                let output = "<form method='post' onsubmit='pasar_valor_submit(); event.preventDefault();'>"
                output += "<select name='profesores' id='profesores'>"

                for (const key in data.usuarios) {
                    output += "<option value='" + data.usuarios[key].id_usuario + "'>" + data.usuarios[key].nombre + "</option>";
                }

                output += "</select>"
                output += "<button id='obtener'>Ver Horario</button>"
                output += "</form >"

                $('#select_profesores').html(output);

            }
            else {
                cargar_vista_error(data.error);
            }
        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });

}


function obtener_horario_admin(id, nombre) {
    console.log(id)
    $.ajax({
        url: encodeURI(DIR_SERV + "/horario/" + id),
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                saltar_a("index.html");
            } else if (data.horario) {
                let output = "";

                output += "<h3 class='centrar'>Horario del Profesor:" + nombre + "</h3>"
                output += "<div class='responsive_table'>"
                output += "<table class='centrar'>"
                output += "<tr>"
                output += "<th></th>"
                output += "<th>Lunes</th>"
                output += "<th>Martes</th>"
                output += "<th>Miércoles</th>"
                output += "<th>Jueves</th>"
                output += "<th>Viernes</th>"
                output += "</tr>"

                let horas = [];
                horas[1] = "8:15-9:15";
                horas[2] = "9:15-10:15";
                horas[3] = "10:15-11:15";
                horas[4] = "10:15-11:45";
                horas[5] = "11:45-12:45";
                horas[6] = "12:45-13:45";
                horas[7] = "13:45-14:45";

                let datos_horario = [];
                let arrayDatos = Object.entries(data.horario);

                arrayDatos.forEach((element, index) => {
                    datos_horario[index] = element;
                });


                for (let i = 1; i <= 7; i++) {
                    output += "<tr>";
                    output += "<th>" + horas[i] + "</th>";
                    if (i == 4) {
                        output += "<td colspan=5>RECREO</td>";
                    } else {
                        for (let j = 1; j <= 5; j++) {
                            output += "<td>";
                            let relleno = false;
                            datos_horario.forEach((element) => {

                                if (element[1].hora == i && element[1].dia == j) {

                                    if (relleno) {
                                        output = output.slice(0, -9)
                                        output += " / " + element[1].nombre_grupo;
                                        output += "<br>(" + element[1].nombre_aula + ")";

                                    } else {
                                        output += element[1].nombre_grupo + " ";
                                        if (element[1].aula != AULA_VACIA) {
                                        output += "<br>(" + element[1].nombre_aula + ")";
                                        }
                                        relleno = true;
                                    }
                                }

                            });
                            if (relleno) {
                                output += "<br>";
                            }
                            output += "<button class='enlace' onclick='mostrar_grupos(" + j + "," + i + "," + id + ");'>Editar</button>";
                            output += "</td>";
                        }
                    }
                    output += "</tr>";
                }

                output += "</table>"
                output += "</div>"
                $('#horario').html(output);

            } else {
                cargar_vista_error(data.error);
            }
        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });
}

function mostrar_grupos(dia, hora, id_profesor) {


    let dias = [];
    dias[1] = "Lunes";
    dias[2] = "Martes";
    dias[3] = "Miércoles";
    dias[4] = "Jueves";
    dias[5] = "Viernes";

    let horas = [];
    horas[1] = "8:15-9:15";
    horas[2] = "9:15-10:15";
    horas[3] = "10:15-11:15";
    horas[4] = "10:15-11:45";
    horas[5] = "11:45-12:45";
    horas[6] = "12:45-13:45";
    horas[7] = "13:45-14:45";

    let output = ""
    if (hora > 4) {
        output += "<h2 class='centrar'>Editando la " + (hora - 1) + "ª hora (" + horas[hora] + ") del " + dias[dia] + "</h2>";
    } else {
        output += "<h2 class='centrar'>Editando la " + hora + "ª hora (" + horas[hora] + ") del " + dias[dia] + "</h2>";
    }

    output += "<div id='mensaje'></div>"
    output += "<table class='responsive_table centrar'>"
    output += "<tr>"
    output += "<th>Grupo (Aula)</th>"
    output += "<th>Acción</th>"
    output += "</tr>"

    $.ajax({
        url: encodeURI(DIR_SERV + "/tieneGrupo/" + dia + "/" + hora + "/" + id_profesor),
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                console.log(data.no_auth)
                saltar_a("index.html");
            }
            else if (data.tiene_grupo) {

                let arrayGrupos = Object.entries(data.grupos);

                if (GRUPOS_SIN_AULA.includes(parseInt(arrayGrupos[0][1].grupo))) {
                    //HORA CON GUARDIA
                    $.ajax({
                        url: encodeURI(DIR_SERV + "/grupos/" + dia + "/" + hora + "/" + id_profesor),
                        type: "GET",
                        dataType: "json"
                    })
                        .done(function (data) {

                            if (data.no_auth) {
                                console.log(data.no_auth)
                                saltar_a("index.html");

                            } else if (data.grupos) {

                                let arrayGrupos = Object.entries(data.grupos)
                                output += "<tr>"
                                output += "<td>" + arrayGrupos[0][1].nombre_grupo + " (" + arrayGrupos[0][1].nombre_aula + ")</td>"
                                output += "<td><button class='enlace' onclick='borrar(" + dia + ", " + hora + "," + id_profesor + "," + arrayGrupos[0][1].id_grupo + ")'>Quitar</button></td>"
                                output += "</tr>"

                                output += "</table>"
                                $('#grupos').html(output);
                            }

                        })
                        .fail(function (a, b) {
                            cargar_vista_error(error_ajax_jquery(a, b));
                        });

                } else {
                    //HORA OCUPADA  
                    $.ajax({
                        url: encodeURI(DIR_SERV + "/grupos/" + dia + "/" + hora + "/" + id_profesor),
                        type: "GET",
                        dataType: "json"
                    })
                        .done(function (data) {

                            if (data.no_auth) {
                                console.log(data.no_auth)
                                saltar_a("index.html");

                            } else if (data.grupos) {
                                let arrayGrupos = Object.entries(data.grupos)
                                for (let i = 0; i < arrayGrupos.length; i++) {
                                    output += "<tr>"
                                    output += "<td>" + arrayGrupos[i][1].nombre_grupo + " (" + arrayGrupos[0][1].nombre_aula + ")</td>"
                                    output += "<td><button class='enlace' onclick='borrar(" + dia + ", " + hora + "," + id_profesor + "," + arrayGrupos[i][1].id_grupo + ")'>Quitar</button></td>"
                                    output += "</tr>"
                                }
                                output += "</table>"

                                output += "<br>"

                                $.ajax({
                                    url: encodeURI(DIR_SERV + "/gruposLibres/" + dia + "/" + hora + "/" + id_profesor),
                                    type: "GET",
                                    dataType: "json"
                                })
                                    .done(function (data) {

                                        if (data.no_auth) {
                                            saltar_a("index.html");
                                        }
                                        else if (data.grupos) {

                                            // output += "<form method='post' onsubmit='pasar_valor_submit2(); event.preventDefault();'>"
                                            output += "<table class='responsive_table no_styles_table' id='select_grupo_table'>"
                                            output += "<tr>"
                                            output += "<td>"
                                            output += "<label for='select_grupos'>Grupo: </label>"
                                            output += "<select name='select_grupos' id='select_grupos'>"

                                            for (const key in data.grupos) {
                                                if (!GRUPOS_SIN_AULA.includes(parseInt(data.grupos[key].id_grupo))) {
                                                    output += "<option value='" + data.grupos[key].id_grupo + "'>" + data.grupos[key].nombre + "</option>";
                                                }
                                            }

                                            output += "</select>"
                                            output += "</td>"
                                            output += "<td>"
                                            output += "<label for='select_aulas'>Aula: </label>"
                                            output += "<select name='select_aulas' id='select_aulas'>"
                                            output += "<option value='" + arrayGrupos[0][1].id_aula + "'>" + arrayGrupos[0][1].nombre_aula + "</option>";
                                            output += "</select>"
                                            output += "</td>"
                                            output += "<td>"
                                            output += "<button onclick='pasar_valor_submit2(" + dia + ", " + hora + ", " + id_profesor + ")'>Añadir</button>"
                                            output += "</td>"
                                            output += "</tr>"

                                            // output += "</form >"
                                            $('#grupos').html(output);
                                        }
                                        else {
                                            cargar_vista_error(data.error);
                                        }
                                    })
                                    .fail(function (a, b) {
                                        cargar_vista_error(error_ajax_jquery(a, b));
                                    });
                            }

                        })
                        .fail(function (a, b) {
                            cargar_vista_error(error_ajax_jquery(a, b));
                        });
                }

            } else {
                //HORA LIBRE
                let aulas_libres = []
                let aulas_ocupadas = []


                $.ajax({
                    url: encodeURI(DIR_SERV + "/gruposLibres/" + dia + "/" + hora + "/" + id_profesor),
                    type: "GET",
                    dataType: "json"
                })
                    .done(function (data) {

                        if (data.no_auth) {
                            saltar_a("index.html");
                        }
                        else if (data.grupos) {

                            //ALMACENAR INFO
                            // $('#grupos').html(output);
                            output += "<table class='responsive_table no_styles_table' id='select_grupo_table'>"
                            output += "<tr>"
                            output += "<td>"
                            output += "<label for='select_grupos'>Grupo: </label>"
                            output += "<select name='select_grupos' id='select_grupos' onchange='aula_sin_asignar();'>"

                            output += "<optgroup label='Sin Aula'>"
                            for (const key in data.grupos) {
                                if (GRUPOS_SIN_AULA.includes(parseInt(data.grupos[key].id_grupo))) {
                                    output += "<option value='" + data.grupos[key].id_grupo + "' selected>" + data.grupos[key].nombre + "</option>";
                                }
                            }
                            output += "</optgroup>"
                            output += "<optgroup label='Con Aula'>"
                            for (const key in data.grupos) {
                                if (!GRUPOS_SIN_AULA.includes(parseInt(data.grupos[key].id_grupo))) {
                                    output += "<option value='" + data.grupos[key].id_grupo + "'>" + data.grupos[key].nombre + "</option>";
                                }
                            }
                            output += "</optgroup>"
                            output += "</select>"
                            output += "</td>"

                            /******************************************************************************************************************************************************************************************  
                             ****************************************************************************AULAS LIBRES*************************************************************************************************/

                            $.ajax({
                                url: encodeURI(DIR_SERV + "/aulasLibres/" + dia + "/" + hora),
                                type: "GET",
                                dataType: "json"
                            })
                                .done(function (data) {

                                    if (data.no_auth) {
                                        saltar_a("index.html");
                                    }
                                    else if (data.aulas_libres) {

                                        output += "<td>"
                                        output += "<label for='select_aulas'>Aula: </label>"
                                        output += "<select name='select_aulas' id='select_aulas' onchange='aula_sin_asignar()'>"
                                        output += "<optgroup label='Libres' id='libre'>"
                                        for (let element in data.aulas_libres) {
                                            aulas_libres[element] = data.aulas_libres[element];
                                        }
                                        aulas_libres.forEach((element) => {
                                            if (element.id_aula == AULA_VACIA) {
                                                output += "<option value='" + element.id_aula + "' selected>" + element.nombre + "</option>";
                                            } else {
                                                output += "<option value='" + element.id_aula + "' >" + element.nombre + "</option>";
                                            }

                                        });
                                        output += "</optgroup>"
                                        /******************************************************************************************************************************************************************************************  
                                        ****************************************************************************AULAS OCUPADAS*************************************************************************************************/
                                        $.ajax({
                                            url: encodeURI(DIR_SERV + "/aulasOcupadas/" + dia + "/" + hora),
                                            type: "GET",
                                            dataType: "json"
                                        })
                                            .done(function (data) {

                                                if (data.no_auth) {
                                                    saltar_a("index.html");
                                                }
                                                else if (data.aulas_ocupadas) {

                                                    output += "<optgroup label='Ocupadas' id='ocupada'>"

                                                    for (let element in data.aulas_ocupadas) {
                                                        aulas_ocupadas[element] = data.aulas_ocupadas[element];
                                                    }
                                                    aulas_ocupadas.forEach((element) => {
                                                        output += "<option value='" + element.id_aula + "' >" + element.nombre + "</option>";
                                                    });

                                                    output += "</optgroup>"
                                                    output += "</select>"
                                                    output += "</td>"
                                                    output += "<td>"
                                                    output += "<td>"
                                                    output += "<button onclick='comprobar_anadir(" + dia + ", " + hora + ", " + id_profesor + ")'>Añadir</button>"
                                                    output += "</td>"
                                                    output += "</tr>"

                                                    output += "</table>"

                                                    $('#grupos').html(output);


                                                }
                                                else {
                                                    console.log("data.error")
                                                    cargar_vista_error(data.error);
                                                }
                                            })
                                            .fail(function (a, b) {
                                                console.log("fail")
                                                cargar_vista_error(error_ajax_jquery(a, b));
                                            });
                                    }
                                    else {
                                        cargar_vista_error(data.error);
                                    }
                                })
                                .fail(function (a, b) {
                                    cargar_vista_error(error_ajax_jquery(a, b));
                                });

                            /******************************************************************************************************************************************************************************************  
                            ******************************************************************************************************************************************************************************************/

                        }
                        else {
                            cargar_vista_error(data.error);
                        }
                    })
                    .fail(function (a, b) {
                        cargar_vista_error(error_ajax_jquery(a, b));
                    });

            }
        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });

}

function comprobar_anadir(dia, hora, id_profesor) {

    let esGrupoSinAula = GRUPOS_SIN_AULA.includes(parseInt($("#select_grupos").val()))
    let esAulaLibre = $("#select_aulas option:selected").parent()[0].id == "libre" && $("#select_aulas").val() != AULA_VACIA


    if (esGrupoSinAula || esAulaLibre) {
        pasar_valor_submit2(dia, hora, id_profesor)
    } else if (!esGrupoSinAula && $("#select_aulas").val() == AULA_VACIA) {
        let mensaje_error = "ERROR. No se ha asignado ninguna aula al grupo"
        volver()
    } else if (!esAulaLibre) {
        $.ajax({
            url: encodeURI(DIR_SERV + "/gruposEnAula/" + dia + "/" + hora + "/" + $("#select_aulas").val()),
            type: "GET",
            dataType: "json"
        })
            .done(function (data) {

                if (data.no_auth) {
                    saltar_a("index.html");
                }
                else if (data.grupos) {


                    let coincideGrupo = false
                    for (const index in data.grupos) {
                        let elemento = data.grupos[index]

                        if (elemento.id_grupo == $("#select_grupos").val()) {
                            pasar_valor_submit2(dia, hora, id_profesor)
                            coincideGrupo = true
                            break;
                        } else {
                            if (!arrayGruposOcupados.includes(elemento)) {
                                arrayGruposOcupados.push(elemento)
                            }                            
                        }
                    }
                    if (!coincideGrupo && arrayGruposOcupados.length > 0) {
                        //MODAL CONFIRMACION CAMBIO
                        mostrar_confirmacion_cambio(dia, hora, id_profesor, $("#select_aulas").val(), $("#select_grupos option:selected").text())
                    }

                }
                else {
                    console.log("data.error")
                    cargar_vista_error(data.error);
                }
            })
            .fail(function (a, b) {
                cargar_vista_error(error_ajax_jquery(a, b));
            });

    }

}

function mostrar_confirmacion_cambio(dia, hora, id_profesor, id_aula, nombre_grupo) {

    let dias = [];
    dias[1] = "Lunes";
    dias[2] = "Martes";
    dias[3] = "Miércoles";
    dias[4] = "Jueves";
    dias[5] = "Viernes";
    let contenido = ""

    if (hora > 4) {
        contenido += "<h3 class='centrar'>Confirmación cambio de aula del " + dias[dia] + " a " + (hora - 1) + "ª hora</h3>";
    } else {
        contenido += "<h3 class='centrar'>Confirmación cambio de aula del " + dias[dia] + " a " + hora + "ª hora</h3>";
    }

    contenido += "<p>Has seleccionado un aula que está siendo usada por :</p>"


    arrayGruposOcupados.forEach(element => {
        contenido += "<p class='centrar'>El profesor " + element.id_profesor + " en el grupo " + element.nombre_grupo + "</p>"
    });

    contenido += "<p>Para añadir este aula a " + nombre_grupo + ", debes cambiarle antes el aula a :</p>"
    arrayGruposOcupados.forEach(element => {
        contenido += "<p class='centrar'>" + element.nombre_grupo + "</p>"
    });

    contenido += "<p class='centrar'><button onclick='cerrar_modal(); volver()'>Cancelar</button><button onclick='modal_cambiar(" + dia + "," + hora + "," + id_profesor + "," + id_aula + "); event.preventDefault()' >Cambiar</button></p>"
    //onclick='modal_cambiar(" + dia + ", " + hora + ", " + id_profesor + ", " + id_aula + ", " + arrayGruposOcupados + ");'

    abrir_modal(contenido)
}

function modal_cambiar(dia, hora, id_profesor, id_aula) {

    let dias = [];
    dias[1] = "Lunes";
    dias[2] = "Martes";
    dias[3] = "Miércoles";
    dias[4] = "Jueves";
    dias[5] = "Viernes";

    let contenido = ""
    let aulas_libres = []

    $.ajax({
        url: encodeURI(DIR_SERV + "/aulasLibres/" + dia + "/" + hora),
        type: "GET",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                saltar_a("index.html");
            }
            else if (data.aulas_libres) {
                contenido += "<h3 class='centrar'>Cambio de aula para los grupos:</h3>"
                arrayGruposOcupados.forEach(element => {
                    contenido += "<p class='centrar'>" + element.nombre_grupo + "</p>"
                });
                contenido += "<p class='centrar'>Elija un nuevo aula libre"
                contenido += "<select id='select_aulas_libres'>"

                contenido += "<optgroup>"

                for (let index in data.aulas_libres) {
                    if (data.aulas_libres[index].id_aula != AULA_VACIA) {
                        aulas_libres[index] = data.aulas_libres[index];
                    }

                }
                aulas_libres.forEach((element) => {
                    contenido += "<option value='" + element.id_aula + "' >" + element.nombre + "</option>";
                });

                contenido += "</select>"
                contenido += "<p class='centrar'><button onclick='cerrar_modal(); volver()'>Cancelar</button>"
                contenido += "<button onclick='pasar_valor_submit3(" + dia + ", " + hora + ", " + id_aula + ");pasar_valor_submit2(" + dia + ", " + hora + ", " + id_profesor + ")'>Cambiar</button></p>"
                contenido += "</td>"
                contenido += "</tr>"

                contenido += "</table>"

                contenido += "</select>"
                contenido += "</p>"

                abrir_modal(contenido)
            }
            else {
                console.log("data.error")
                cargar_vista_error(data.error);
            }
        })
        .fail(function (a, b) {
            console.log("fail")
            cargar_vista_error(error_ajax_jquery(a, b));
        });
}

function pasar_valor_submit() {

    id_profesor_actual = $("#profesores").val()
    nombre_profesor_actual = $("#profesores option:selected").text()


    obtener_horario_admin(id_profesor_actual, nombre_profesor_actual)
}

function pasar_valor_submit2(dia, hora, id_profesor) {

    var id_grupo = $("#select_grupos").val()
    var id_aula = $("#select_aulas").val()
    insertar_grupo(dia, hora, id_profesor, id_grupo, id_aula)
    volver()
}

function pasar_valor_submit3(dia, hora, id_aula) {

    var id_aula_nueva = $("#select_aulas_libres").val()

    arrayGruposOcupados.forEach(element => {

        $.ajax({
            url: encodeURI(DIR_SERV + "/actualizarGrupo/" + id_aula_nueva + "/" + dia + "/" + hora + "/" + element.id_grupo + "/" + id_aula),
            type: "PUT",
            dataType: "json"
        })
            .done(function (data) {

                if (data.no_auth) {
                    saltar_a("index.html");
                }
                else if (data.mensaje) {
                    let mensaje = "Grupos actualizados con éxito"
                    volver()
                }
                else {
                    console.log("data.error")
                    console.log(data.error)
                    cargar_vista_error(data.error);
                }
            })
            .fail(function (a, b) {
                console.log("fail")
                cargar_vista_error(error_ajax_jquery(a, b));
            });

    });
    cerrar_modal()
    // volver()
}

function pasar_valor_submit4() {

    obtener_horario_admin(id_profesor_actual, nombre_profesor_actual)
}

function aula_sin_asignar() {
    if (GRUPOS_SIN_AULA.includes(parseInt($("#select_grupos").val()))) {
        $("#select_aulas").val(AULA_VACIA);
    }
}

function insertar_grupo(dia, hora, id_profesor, id_grupo, id_aula) {
    $.ajax({
        url: encodeURI(DIR_SERV + "/insertarGrupo/" + dia + "/" + hora + "/" + id_profesor + "/" + id_grupo + "/" + id_aula),
        type: "POST",
        dataType: "json"
    })
        .done(function (data) {

            if (data.no_auth) {
                saltar_a("index.html");
            }
            else if (data.mensaje) {

                $('#mensaje').html(data.mensaje);
                pasar_valor_submit4()
                mostrar_grupos(dia, hora, id_profesor)

            }
            else {
                cargar_vista_error(data.error);
            }
        })
        .fail(function (a, b) {
            cargar_vista_error(error_ajax_jquery(a, b));
        });
}
