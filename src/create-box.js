const makerjs = require('makerjs');
const fs = require('fs');

const mmToPoint = (n1) => {
  return n1 * 2.8346438836889;
};

async function createBox(width, long, height, tickness, smallsides, bottomside, arround, center) {
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
      left_h1: new makerjs.paths.Line([0, tickness], [-smallsides - height, tickness]),
      left_h2: new makerjs.paths.Line([0, width - tickness], [-smallsides - height, width - tickness]),
      left_v1: new makerjs.paths.Line([-smallsides - height, width - tickness], [-smallsides - height, tickness]),
      //Droite
      right_h1: new makerjs.paths.Line([long + smallsides + height, tickness], [long, tickness]),
      right_h2: new makerjs.paths.Line([long + smallsides + height, width - tickness], [long, width - tickness]),
      right_v1: new makerjs.paths.Line(
        [long + smallsides + height, width - tickness],
        [long + smallsides + height, tickness],
      ),
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

  const svg = makerjs.exporter.toSVG(model, { units: 'cm', layerOptions: { dec: { color: 2 } } });
  const dxf = makerjs.exporter.toDXF(model, { units: 'cm', layerOptions: { dec: { color: 2 } } });

  try {
    //${width}x${long}x${height}.dxf
    if (fs.existsSync(`./public/temp/`)) {
      await fs.writeFileSync(`./public/temp/${width}x${long}x${height}${center == 1.5 ? '_center ' : ''}cm.dxf`, dxf);
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}${data[0].center == 1.5 ? '_center ' : ''}cm.svg`,
        svg,
      );
    } else {
      await fs.mkdirSync(`./public/temp/`, { recursive: true });
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}${data[0].center == 1.5 ? '_center ' : ''}cm.dxf`,
        dxf,
      );
      await fs.writeFileSync(
        `./public/temp/${width}x${long}x${height}${data[0].center == 1.5 ? '_center ' : ''}cm.svg`,
        svg,
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = createBox;
