const makerjs = require('makerjs');
const fs = require('fs');

const mmToPoint = (n1) => {
  return n1 * 2.8346438836889;
};

let measure = []


async function createBox(width, long, height, tickness, smallsides, bottomside, arround, center, oreilles, clone) {

  
  const model = {
    models: {
      rec: new makerjs.models.Rectangle(long, width),
    },
    paths: {
      //Rainants
      //Grands cotés
      top: new makerjs.paths.Line([0, width + height + tickness], [long, width + height + tickness]),
      bottom: new makerjs.paths.Line([0, -height - tickness], [long, -height - tickness]),
      //Petits cotés
      left: new makerjs.paths.Line([-height, +tickness], [-height, width - tickness]),
      right: new makerjs.paths.Line([long + height, tickness], [long + height, width - tickness]),
      //Gauche
      rainant_left_h1: new makerjs.paths.Line([0, tickness], [-height, tickness]),
      rainant_left_h2: new makerjs.paths.Line([0, width - tickness], [-height, width - tickness]),
      //Droite
      rainant_right_h1: new makerjs.paths.Line([long, width - tickness], [long + height, width - tickness]),
      rainant_right_h2: new makerjs.paths.Line([long, tickness], [long + height, tickness]),

      //DECOUPE
      //haut
      top_v1: new makerjs.paths.Line([0, width - tickness], [0, width * center + height + tickness]),
      top_v2: new makerjs.paths.Line([long, width - tickness], [long, width * center + height + tickness]),
      top_h1: new makerjs.paths.Line(
        [0, width * center + height + tickness],
        [long, width * center + height + tickness],
      ),
      //bas
      bottom_v1: new makerjs.paths.Line([0, -bottomside - height - tickness], [0, tickness]),
      bottom_v2: new makerjs.paths.Line([long, -bottomside - height - tickness], [long, tickness]),
      bottom_h1: new makerjs.paths.Line([0, -bottomside - height - tickness], [long, -bottomside - height - tickness]),
      //Gauche
      left_h1: new makerjs.paths.Line([-height, tickness], [-smallsides - height, tickness]),
      left_h2: new makerjs.paths.Line([-height, width - tickness], [-smallsides - height, width - tickness]),
      left_v1: new makerjs.paths.Line([-smallsides - height, width - tickness], [-smallsides - height, tickness]),
      //oreilles Bas Gauche
      oreilles_left_bottom_v1: oreilles ? new makerjs.paths.Line([-height / 8, -smallsides / 2], [0, tickness]) : null,
      oreilles_left_bottom_v2: oreilles
        ? new makerjs.paths.Line([-height + height / 8, -smallsides / 2], [-height, tickness])
        : null,
      oreilles_left_bottom: oreilles
        ? new makerjs.paths.Line([-height / 8, -smallsides / 2], [-height + height / 8, -smallsides / 2])
        : null,
      //oreilles Haut Gauche
      oreilles_left_top_v1: oreilles
        ? new makerjs.paths.Line([0, width - tickness], [-height / 8, width + smallsides / 2])
        : null,
      oreilles_left_top_v2: oreilles
        ? new makerjs.paths.Line([-height + height / 8, width + smallsides / 2], [-height, width - tickness])
        : null,
      oreilles_left_top: oreilles
        ? new makerjs.paths.Line([-height + height / 8, width + smallsides / 2], [-height / 8, width + smallsides / 2])
        : null,
      //Droite
      right_h1: new makerjs.paths.Line([long + height, tickness], [long + height + smallsides, tickness]),
      right_h2: new makerjs.paths.Line(
        [long + height, width - tickness],
        [long + height + smallsides, width - tickness],
      ),
      right_v1: new makerjs.paths.Line(
        [long + smallsides + height, width - tickness],
        [long + smallsides + height, tickness],
      ),
      //oreilles Bas Droite
      oreilles_right_bottom_v1: oreilles
        ? new makerjs.paths.Line([long, tickness], [long + height / 8, -smallsides / 2])
        : null,
      oreilles_right_bottom_v2: oreilles
        ? new makerjs.paths.Line([long + height, tickness], [long + height - height / 8, -smallsides / 2])
        : null,
      oreilles_right_bottom: oreilles
        ? new makerjs.paths.Line([long + height / 8, -smallsides / 2], [long + height - height / 8, -smallsides / 2])
        : null,
      //oreilles Haut Droite
      oreilles_right_top_v1: oreilles
        ? new makerjs.paths.Line([long, width - tickness], [long + height / 8, width + smallsides / 2])
        : null,
      oreilles_right_top_v2: oreilles
        ? new makerjs.paths.Line(
            [long + height, width - tickness],
            [long + -height / 8 + height, width + smallsides / 2],
          )
        : null,
      oreilles_right_top: oreilles
        ? new makerjs.paths.Line(
            [long + height / 8, width + smallsides / 2],
            [long + -height / 8 + height, width + smallsides / 2],
          )
        : null,
    },
  };
  model.layer = 'dec';

  //format base
  model.models.rec.layer = 'orange';
  //height
  model.paths.top.layer = 'orange';
  model.paths.bottom.layer = 'orange';
  model.paths.left.layer = 'orange';
  model.paths.right.layer = 'orange';
  if (oreilles == true) {
    model.paths.rainant_left_h1.layer = 'orange';
    model.paths.rainant_left_h2.layer = 'orange';
    model.paths.rainant_right_h1.layer = 'orange';
    model.paths.rainant_right_h2.layer = 'orange';
  } else {
    model.paths.rainant_left_h1.layer = 'red';
    model.paths.rainant_left_h2.layer = 'red';
    model.paths.rainant_right_h1.layer = 'red';
    model.paths.rainant_right_h2.layer = 'red';
  }

  //decoupe
  //haut
  model.paths.top_v1.layer = 'red';
  model.paths.top_v2.layer = 'red';
  model.paths.top_h1.layer = 'red';
  //bas
  model.paths.bottom_v1.layer = 'red';
  model.paths.bottom_v2.layer = 'red';
  model.paths.bottom_h1.layer = 'red';
  //gauche
  model.paths.left_h1.layer = 'red';
  model.paths.left_h2.layer = 'red';
  model.paths.left_v1.layer = 'red';
  //Droite
  model.paths.right_h1.layer = 'red';
  model.paths.right_h2.layer = 'red';
  model.paths.right_v1.layer = 'red';
  //oreilles
  if (oreilles == true) {
    model.paths.oreilles_left_bottom.layer = 'red';
    model.paths.oreilles_left_bottom_v1.layer = 'red';
    model.paths.oreilles_left_bottom_v2.layer = 'red';
    model.paths.oreilles_left_top.layer = 'red';
    model.paths.oreilles_left_top_v1.layer = 'red';
    model.paths.oreilles_left_top_v2.layer = 'red';
    model.paths.oreilles_right_bottom.layer = 'red';
    model.paths.oreilles_right_bottom_v1.layer = 'red';
    model.paths.oreilles_right_bottom_v2.layer = 'red';
    model.paths.oreilles_right_top.layer = 'red';
    model.paths.oreilles_right_top_v1.layer = 'red';
    model.paths.oreilles_right_top_v2.layer = 'red';
  }

  //makerjs.model.center(model.models.rec)

  if (arround > 0) {
    const fil1 = makerjs.path.fillet(model.paths.left_h1, model.paths.left_v1, arround);
    model.paths.fil1 = fil1;
    model.paths.fil1.layer = 'red';
    const fil2 = makerjs.path.fillet(model.paths.left_h2, model.paths.left_v1, arround);
    model.paths.fil2 = fil2;
    model.paths.fil2.layer = 'red';
    const fil3 = makerjs.path.fillet(model.paths.right_h2, model.paths.right_v1, arround);
    model.paths.fil3 = fil3;
    model.paths.fil3.layer = 'red';
    const fil4 = makerjs.path.fillet(model.paths.right_h1, model.paths.right_v1, arround);
    model.paths.fil4 = fil4;
    model.paths.fil4.layer = 'red';
  }

  let copy
  if(clone == true) {
    const cloneModel = makerjs.cloneObject(model)
     copy = {models:{old: model, new: cloneModel}}
    //makerjs.model.rotate(cloneModel, 0)
    makerjs.model.move(cloneModel, [(long+smallsides+height)+2.5, (-width-smallsides/2)-2.5])
  }
  
  //max dimensions
  measure.push()
  measure.push(copy ? makerjs.measure.modelExtents(copy) : makerjs.measure.modelExtents(model))   

  const svg = makerjs.exporter.toSVG(clone ? copy : model, { units: 'cm', layerOptions: { dec: { color: 2 } } });
  const dxf = makerjs.exporter.toDXF(clone ? copy : model, { units: 'cm', layerOptions: { dec: { color: 2 } } });

  try {
    //${width}x${long}x${height}.dxf
    if (fs.existsSync(`./public/temp/`)) {
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}cm${center == 1.5 ? '_center' : ''}${oreilles ? '_oreilles' : ''}${clone ? '_copy' : ''}.dxf`,
        dxf,
      );
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}cm${center == 1.5 ? '_center' : ''}${oreilles ? '_oreilles' : ''}${clone ? '_copy' : ''}.svg`,
        svg,
      );
    } else {
      await fs.mkdirSync(`./public/temp/`, { recursive: true });
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}cm${center == 1.5 ? '_center' : ''}${oreilles ? '_oreilles' : ''}${clone ? '_copy' : ''}.dxf`,
        dxf,
      );
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}cm${center == 1.5 ? '_center' : ''}${oreilles ? '_oreilles' : ''}${clone ? '_copy' : ''}.svg`,
        svg,
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {createBox: createBox, measure: measure};
