(function () {
'use strict';

angular.module('Encuestas')
.component('comentarios', {
  templateUrl: '../../../html/comentarios.template.html',
  bindings: {
    comentarioActual: '<'
    , resultados: '<'
    , sumarizados: '<'
    , onCambioComentario: '&'
  }
});

})();
