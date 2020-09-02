(function () {
'use strict';

angular.module('Encuestas')
.config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function RoutesConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('ppal', {  // Página ppal
    url: '/'
    , templateUrl: 'html/home.template.html'
    , controller: 'SelectorCuatrimestreController as scc'
    , resolve: {
      cuatrimestres: ['DatosEncuestasService', function (DatosEncuestasService) {
        return DatosEncuestasService.cargarCuatrimestres();
      }]
    }
  })

  .state('ppal.cuat', {  // Con un cuatrimestre elegido
    url: 'cuat/:cuatId/:materia'
    , templateUrl: 'html/cuat.template.html'
    , controller: 'SelectorMateriaController as smc'
    , resolve: {
      datosEncuestas: ['DatosEncuestasService', 'cuatrimestres', '$stateParams',
        function (DatosEncuestasService, cuatrimestres, $stateParams) {
          var ret = {"mat":[], "resp":{}, "sum":{}}; // Default si falla todo
          cuatrimestres.forEach(function(cuat) {
            if (cuat.id === $stateParams.cuatId) {
              ret = DatosEncuestasService.cargarMaterias(cuat);
            }
          });
          return ret;
      }]
    }
  })

  ;
}

})();
