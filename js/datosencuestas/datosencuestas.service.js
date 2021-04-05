(function () {
'use strict';

    angular.module('DatosEncuestas')
    .service('DatosEncuestasService', DatosEncuestasService);

    // DatosEncuestasService: Maneja los datos de una encuesta
    DatosEncuestasService.$inject = ['$http','ProcesarCSVService']
    function DatosEncuestasService ($http,ProcesarCSVService){
        var service = this;

        // Carga los datos de todos los cuatrimestres
        service.cargarCuatrimestres = function() {
          return $http({ "method": "GET", "url": "encuestas/cuatrimestres.json" })
          .then(function (result) {
            return result.data;
          });
        }

        // Carga las materias de un cuatrimestre
        service.cargarMaterias = function(cuatrimestre) {
          return service.cargarDeURL(cuatrimestre.url, cuatrimestre.formato);
        }

        service.cargarDeURL = function (url, formato) {
          return $http({ "method": "GET", "url": url }).then(function(response) {
            var papaRes = Papa.parse(response.data, {
              header:true , skipEmptyLines: true
              , transformHeader: function(h,i) { return "" + i; } // quiero los headers numericos
            });
            return ProcesarCSVService.procesarCSV(papaRes.data, formato);
          });
        };
    }

})();
