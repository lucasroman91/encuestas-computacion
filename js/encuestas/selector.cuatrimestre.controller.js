(function () {
'use strict';

    angular.module('Encuestas')
    .controller('SelectorCuatrimestreController', SelectorCuatrimestreController);

    // CargarCSVController: Carga los datos de la encuesta
    SelectorCuatrimestreController.$inject = ['$state','cuatrimestres','$stateParams','$rootScope'];
    function SelectorCuatrimestreController ($state, cuatrimestres, $stateParams, $rootScope){
        var scc = this;
        scc.urls = cuatrimestres;
        scc.materias = [];
        scc.listeners = [];

        // Al elegir un URL, carga los datos de la encuesta del CSV del URL
        scc.elegirURL = function() {
          $state.go("ppal.cuat",{cuatId: scc.cuatrimestre.id, materia: null });
        }

        // Si entra en otro estado que tiene que cambiar el cuat, llama a esto
        scc.listeners.push( $rootScope.$on('encuesta:elegircuatrimestre'
          , function(event, data){
            scc.urls.forEach(function(url) {
              if (url.id === data.id) {
                scc.cuatrimestre = url;
              }
            });
          }));

        // Matar los listeners
        scc.$onDestroy = function () {
          rc.listeners.forEach(function(listener){
            listener();
          });
        };


    }

})();
