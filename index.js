var app = require('express')();
var debug = require('debug')('presupuesto');
var parse = require('csv-parse');
var fs = require('fs');
var port = process.env.PORT || 8080;

app.get('/flare.json', function (req, res, next) {
  try {
    var result = {
      name: "flare",
      children: []
    };
    var raiz = {};

    var parser = parse({delimiter: ','}, function(err, data){
      for (var i = 1; i < data.length; i++) {
        var fila = data[i];

        raiz[fila[0]] = raiz[fila[0]] || {}; // caracter
        raiz[fila[0]][fila[2]] = raiz[fila[0]][fila[2]] || {}; // jurisdiccion_desc
        raiz[fila[0]][fila[2]][fila[4]] =  raiz[fila[0]][fila[2]][fila[4]] || {}; // entidad_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]] =  raiz[fila[0]][fila[2]][fila[4]][fila[6]] || {}; //servicio_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]] =  raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]] ||
{}; // programa_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]] =
raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]] ||
{}; // finalidad_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]] =
raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]] ||
{}; // funcion_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]][fila[14]] =
raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]][fila[14]] ||
{}; // inciso_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]][fila[14]][fila[16]] =
raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]][fila[14]][fila[16]] ||
{}; // principal_desc
        raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]][fila[14]][fila[16]] =
(raiz[fila[0]][fila[2]][fila[4]][fila[6]][fila[8]][fila[10]][fila[12]][fila[14]][fila[16]][fila[18]] ||
0) + (Number(fila[25].replace(',', '.')));
      }

      function getNode(name, o) {
        if (typeof(o) == 'number') {
          return {
            name: name + ' (' + o.toString() + ')',
            size: o
          }
        }
        else {
          var n = {
            name: name,
            children: []
          };

          for (var k in o) n.children.push(getNode(k, o[k]));

          return n;
        }
      }

      for (var k in raiz) result.children.push(getNode(k, raiz[k]));

      res.json(result);
    });

    fs.createReadStream(require('path').join(__dirname,
'presupuesto-2016.csv')).pipe(parser);
  } catch (e) {
    next(e);
  }
});

app.use(require('serve-static')(require('path').join(__dirname,
'static')));

app.listen(port, function () {
  debug('listening on http://localhost:%s/', port);
});
