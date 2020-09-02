(function () {
'use strict';

    angular.module('Encuestas')
    .controller('SelectorMateriaController', SelectorMateriaController);

    // CargarCSVController: Carga los datos de la encuesta
    SelectorMateriaController.$inject = ['$state', 'datosEncuestas','$stateParams','$rootScope'];
    function SelectorMateriaController ($state, datosEncuestas, $stateParams, $rootScope){
        var smc = this;
        // Almacenar los 3 datos que vienen de una encuesta: Listado de materias, respuestas y sumarizados
        smc.materias = datosEncuestas.mat;
        smc.respuestas = datosEncuestas.resp;
        smc.sumarizados = datosEncuestas.sum;

        // Al inicializar, si hay un cuatrimestre hacer que se eliga (por si entro de una)
        // y si hay materia, seleccionarla en el combo
        smc.$onInit = function () {
          if ($stateParams.cuatId != null && $stateParams.cuatId.length > 0) {
            $rootScope.$broadcast('encuesta:elegircuatrimestre'
              , { id: $stateParams.cuatId });
          }
          smc.materia = "";
          if ($stateParams.materia != null && $stateParams.materia.length > 0) {
            smc.materia = $stateParams.materia;
          }
          // Avisar que cambio una materia, para que se muestren sus comentarios
          $rootScope.$broadcast('encuesta:cambiomateria'
            , {
              resp: smc.respuestas[smc.materia]
              , sum: smc.sumarizados[smc.materia]
            });
        }

        // Al elegir una materia, cambia el URL
        smc.elegirMateria = function() {
          $state.go("ppal.cuat",{cuatId: $stateParams.cuatId, materia: this.materia});
        }
    }

})();
