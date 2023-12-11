const makerjs = require('makerjs');
const fs = require('fs')

const mmToPoint = (n1) => {
  return n1 * 2.8346438836889
}

function createBox(largeur, longueur, hauteur, marge, ep) {
largeur = 800
longueur = 1000

  const box = {
      //Rainants principaux
      paths:{
            r1: new makerjs.paths.Line([0, 0],[0, largeur])
      }
    }

    //makerjs.model.center(box.models.r1)
    const dxf = makerjs.exporter.toDXF(box, {units: 'cm'})
  try {
    fs.writeFileSync('./test.dxf', dxf)
    console.log('Success write')
  } catch (error) {
    console.log(error)
  }

}
