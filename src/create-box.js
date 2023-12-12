const makerjs = require('makerjs');
const fs = require('fs')

const mmToPoint = (n1) => {
  return n1 * 2.8346438836889
}

function createBox(largeur, longueur, hauteur, marge, ep) {
   largeur = 100;
   longueur = 200;
   hauteur = 10;
   ep = 0.7;
   const smallSides =  20
   const arround = {
    enabled: true,
    value: 10
   }

  const model = {
    models: {
      rec: new makerjs.models.Rectangle(longueur, largeur),
    },
    paths: {

      //Rainants
      //Grands cotés
      top: new makerjs.paths.Line([0, largeur + hauteur + ep], [longueur, largeur + hauteur + ep]),
      bottom: new makerjs.paths.Line([0, -hauteur - ep], [longueur, -hauteur - ep]),
      //Petits cotés
      left: new makerjs.paths.Line([- hauteur, + ep], [- hauteur, largeur - ep]),
      right: new makerjs.paths.Line([longueur + hauteur, ep], [longueur + hauteur, largeur - ep]),


      //DECOUPE
      //haut
      top_v1: new makerjs.paths.Line([0, largeur - ep], [0, (largeur * 2) + hauteur + ep]),
      top_v2: new makerjs.paths.Line([longueur, largeur - ep], [longueur, (largeur * 2) + hauteur + ep]),
      top_h1: new makerjs.paths.Line([0, (largeur * 2) + hauteur + ep], [longueur, (largeur * 2) + hauteur + ep]),
      //bas
      bottom_v1: new makerjs.paths.Line([0, (-largeur / 2) - hauteur], [0, ep]),
      bottom_v2: new makerjs.paths.Line([longueur, (-largeur / 2) - hauteur], [longueur, ep]),
      bottom_h1: new makerjs.paths.Line([0, -(largeur / 2) - hauteur], [longueur, -(largeur / 2) - hauteur]),
      //Gauche
      left_h1: new makerjs.paths.Line([0, ep], [-smallSides - hauteur, ep]),
      left_h2: new makerjs.paths.Line([0, largeur - ep], [-smallSides - hauteur, largeur - ep]),
      left_v1: new makerjs.paths.Line([-smallSides - hauteur, largeur - ep], [-smallSides - hauteur, ep]),
      //Droite
      right_h1: new makerjs.paths.Line([longueur + smallSides + hauteur, ep], [longueur, ep]),
      right_h2: new makerjs.paths.Line([longueur + smallSides + hauteur, largeur - ep], [longueur, largeur - ep]),
      right_v1: new makerjs.paths.Line([longueur + smallSides + hauteur, largeur - ep], [longueur + smallSides + hauteur, ep]),
    }
  };
  model.layer = "dec"
  
  //format base
  model.models.rec.layer = "orange"
  //hauteur
  model.paths.top.layer = "orange"
  model.paths.bottom.layer = "orange"
  model.paths.left.layer = "orange"
  model.paths.right.layer = "orange"
  //decoupe
  //haut
  model.paths.top_v1.layer = 'red'
  model.paths.top_v2.layer = 'red'
  model.paths.top_h1.layer = 'red'
  //bas
  model.paths.bottom_v1.layer = 'red'
  model.paths.bottom_v2.layer = 'red'
  model.paths.bottom_h1.layer = 'red'
  //gauche
  model.paths.left_h1.layer = 'red'
  model.paths.left_h2.layer = 'red'
  model.paths.left_v1.layer = 'red'
  //Droite
  model.paths.right_h1.layer = 'red'
  model.paths.right_h2.layer = 'red'
  model.paths.right_v1.layer = 'red'


  //makerjs.model.center(model.models.rec)


if(arround.enabled){
  const fil1 = makerjs.path.fillet(model.paths.left_h1, model.paths.left_v1, arround.value)
  model.paths.fil1 = fil1
  model.paths.fil1.layer = 'red'
  const fil2 = makerjs.path.fillet(model.paths.left_h2, model.paths.left_v1, arround.value)
  model.paths.fil2 = fil2
  model.paths.fil2.layer = 'red'
  const fil3 = makerjs.path.fillet(model.paths.right_h2, model.paths.right_v1, arround.value)
  model.paths.fil3 = fil3
  model.paths.fil3.layer = 'red'
  const fil4 = makerjs.path.fillet(model.paths.right_h1, model.paths.right_v1, arround.value)
  model.paths.fil4 = fil4
  model.paths.fil4.layer = 'red'
}

  const svg = makerjs.exporter.toSVG(model);
  const dxf = makerjs.exporter.toDXF(model, {units: 'cm', layerOptions:{"dec":{color: 2}}})
  try {
    fs.writeFileSync(`${largeur}x${longueur}x${hauteur}.dxf`, dxf)
    console.log('Success write')
  } catch (error) {
    console.log(error)
  }

}
createBox()