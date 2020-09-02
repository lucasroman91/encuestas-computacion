(function () {
'use strict';

    angular.module('DatosEncuestas')
    // Posiciones de los campos en el CSV
    .constant('CSVINDEXS', {"curso":1,"general":2, "aprobo": 3 , "temas": 4 , "temasActualizados": 5
        , "teoricas": 6 , "practicas": 7 , "dificultadCurso": 8 , "dificultadTP": 9 , "comentarios": 10
    })
    // Para pasar de textos a numeros de 0 a 5
    .constant('TEXTOANUM', {"excelentes": 5, "muy buenas":4, "buenas": 3 , "regulares": 2 , "malas": 1
        , "excelente": 5, "muy bueno": 4, "bueno": 3 , "regular": 2 , "malo": 1
        , "muy dificil": 5 , "dificil": 4 , "normal": 3 , "fácil": 2 , "muy fácil": 1
        , "facil": 2 , "muy facil": 1, "no hay tp": 0
        , "muy interesantes": 5 , "interesantes": 3 , "poco interesantes": 2, "nada interesantes": 1
        , "no hay clases prácticas": 0 , "no hay clases teóricas": 0
    })
    .service('ProcesarCSVService', ProcesarCSVService);

    // DatosEncuestasService: Maneja los datos de una encuesta
    ProcesarCSVService.$inject = ['CSVINDEXS','TEXTOANUM']
    function ProcesarCSVService (CSVINDEXS,TEXTOANUM){
        var service = this;

        // Procesa todas las líneas del CSV
        service.procesarCSV = function(csvLines) {
            var respuestas = {};
            // Parsear cada linea del CSV agregandola a ret
            csvLines.forEach(function(line) {
                parsearLinea(line,respuestas);
            });
            // Ordenar todas las materias y sumarizar
            var sumarizados = {};
            var materias = [];
            for (var materia in respuestas){
                sumarizados[materia] = {};
                respuestas[materia].sort(function(a,b){
                        if (a['docente'] < b['docente']) return -1;
                        if (a['docente'] > b['docente']) return 1;
                        return 0;
                    }).forEach(function(item) {
                        if (! (item['docente'] in sumarizados[materia])) {
                          // Item inicial
                          sumarizados[materia][item['docente']] = {
                              'cant': 0
                              , 'general': 0
                              , 'temas': 0
                              , 'teoricas': 0
                              , 'practicas': 0
                              , 'dificultadCurso': 0
                              , 'dificultadTP': 0
                          }
                        }
                        var sumarizadoActual = sumarizados[materia][item['docente']];
                        sumarizadoActual['cant'] ++;
                        sumarizadoActual['general'] += item['generalNum'];
                        sumarizadoActual['temas'] += item['temasNum'];
                        sumarizadoActual['teoricas'] += item['teoricasNum'];
                        sumarizadoActual['practicas'] += item['practicasNum'];
                        sumarizadoActual['dificultadCurso'] += item['dificultadCursoNum'];
                        sumarizadoActual['dificultadTP'] += item['dificultadTPNum'];
                    });
                // Armar la lista de materias por separado
                materias.push(materia);
            }
            materias.sort();
            return {'mat': materias, 'resp': respuestas, 'sum': sumarizados};
        }

        // ********************
        // FUNCIONES AUXILIARES
        // ********************
        
        // Saca (o intenta sacar, bah) la materia, el curso y el docente de la línea
        function obtenerMateriaCursoYDocente(linea) {
            // En general viene separado por guiones
            var materiaCompleta = linea[CSVINDEXS['curso']].split("-");
            if (materiaCompleta.length < 2) {
                // Si no, roguemos que venga separado por coma
                materiaCompleta = linea[CSVINDEXS['curso']].split(",");
                // Si son exactamente dos cosas, el formato es materia, docente
                if (materiaCompleta.length == 2) {
                  return [materiaCompleta[0].trim(),"",materiaCompleta[1].trim()]
                }
                console.log("No pude parsear: " + linea[CSVINDEXS['curso']]);
                return ["Error","Error","Error"];
            }
            // Hay un caso particular que es una materia sin docente
            if ((materiaCompleta.length == 2) && (materiaCompleta[0].length == 5)) {
                return [materiaCompleta.join("-").trim(),"","Sin docente"]
            }
            // El docente es lo ultimo de todo
            var docente = materiaCompleta.pop().trim();
            // sacar el curso si lo tiene. Es a veces un numero, a veces "N y N"
            var curso = "";
            if (materiaCompleta.length > 1) {
                var posibleCurso = materiaCompleta[materiaCompleta.length - 1].trim();
                if ((posibleCurso.length > 0) && (!isNaN(posibleCurso.charAt(0)))) {
                    curso = materiaCompleta.pop().trim();
                }
            }
            var materia = materiaCompleta.join("-").trim();
            return [materia, curso, docente]
        }

        // Parsea una linea del CSV generando los datos a mostrar en el browse
        function parsearLinea(linea, datos) {
            if (!(CSVINDEXS['curso'] in linea)) return;
            const [materia, curso, docente] = obtenerMateriaCursoYDocente(linea);
            if (! (materia in datos)) {
                datos[materia] = [];
            }
            datos[materia].push({
                "docente": docente
                , "curso": curso
                , "general": linea[CSVINDEXS['general']]
                , "generalNum": TextoANum(linea[CSVINDEXS['general']])
                , "aprobo": linea[CSVINDEXS['aprobo']]
                , "temas": linea[CSVINDEXS['temas']]
                , "temasNum": TextoANum(linea[CSVINDEXS['temas']])
                , "temasActualizados": linea[CSVINDEXS['temasActualizados']]
                , "teoricas": linea[CSVINDEXS['teoricas']]
                , "teoricasNum": TextoANum(linea[CSVINDEXS['teoricas']])
                , "practicas": linea[CSVINDEXS['practicas']]
                , "practicasNum": TextoANum(linea[CSVINDEXS['practicas']])
                , "dificultadCurso": linea[CSVINDEXS['dificultadCurso']]
                , "dificultadCursoNum": TextoANum(linea[CSVINDEXS['dificultadCurso']])
                , "dificultadTP": linea[CSVINDEXS['dificultadTP']]
                , "dificultadTPNum": TextoANum(linea[CSVINDEXS['dificultadTP']])
                , "comentarios": linea[CSVINDEXS['comentarios']]
            });
        }

        // Convierte (si puede) a texto
        function TextoANum(texto) {
            texto = texto.trim().toLowerCase();
            if (texto in TEXTOANUM) {
                return TEXTOANUM[texto];
            }
            console.log("NO esta: " + texto);
            return 0;
        }
    }

})();
