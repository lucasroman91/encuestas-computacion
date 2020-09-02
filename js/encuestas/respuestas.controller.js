(function () {
'use strict';

    angular.module('Encuestas')
    .controller('RespuestasController', RespuestasController);

    // RespuestasController: Permite ver las respuestas de la materia seleccionada
    RespuestasController.$inject = ['$rootScope'];
    function RespuestasController ($rootScope){
        var rc = this;
        rc.comentarioActual = "";
        rc.resultados = [];
        rc.listeners = [];
        rc.sumarizados = {};

        // Cambia el comentario actual
        rc.cambiarComentario = function(cmt) {
          rc.comentarioActual = cmt;
        }

        // Cuando cambia la materia, actualizar a los resultados de la materia actual
        rc.listeners.push( $rootScope.$on('encuesta:cambiomateria'
          , function(event, data){
            rc.resultados = data.resp;
            rc.sumarizados = data.sum;
          }) );

        // Matar los listeners
        rc.$onDestroy = function () {
          rc.listeners.forEach(function(listener){
            listener();
          });
        };

    }
})();
