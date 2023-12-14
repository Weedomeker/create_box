/* eslint-disable no-undef */
import './App.css';
import { Form, Button, Icon, Label } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
const HOST = 'localhost' || import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function App() {
  const [format, setFormat] = useState(null);
  const [state, setState] = useState({
    width: 0,
    long: 0,
    height: 0,
    tickness: 0,
    smallsides: 0,
    arround: 0,
    center: 2,
  });

  useEffect(() => {
    const maxWidth = state.width * 2 + state.height * 2 + state.tickness + state.width / 2;
    const maxLong = state.long + state.height * 2 + state.smallsides * 2;
    setFormat(maxWidth + ' x ' + maxLong + 'cm');
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      width: formData.get('width'),
      long: formData.get('long'),
      height: formData.get('height'),
      tickness: formData.get('tickness'),
      smallsides: formData.get('smallsides'),
      arround: formData.get('arround'),
      center: formData.get('center'),
    };

    fetch(`http://${HOST}:${PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        res.status == 200 ? console.log('Success') : console.log('error post data');
      })
      .catch((err) => console.log(err));

    form.reset();
    fetch(`http://${HOST}:${PORT}/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/dxf',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${data.width}x${data.long}x${data.height}cm.dxf`);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  const handleChange = (e, { name, value }) => {
    setState({ ...state, [name]: parseFloat(value) });
  };

  return (
    <div className="mx-auto px-20 h-screen  bg-zinc-800">
      <div className="py-10 pt-20">
        <h1 className="text-zinc-300 font-extralight uppercase tracking-widest text-center">
          Create B
          <Icon name="box" size="small" circular className="bg-amber-600 text-zinc-800" />x
        </h1>
      </div>

      <Form onSubmit={handleSubmit} className=" mx-auto h-1/2 content-center bg-gray-600 rounded-md p-4 ">
        <Form.Group widths="equal" className="pb-4 py-5">
          <Form.Field className="text-zinc-100">
            <Form.Input
              type="number"
              step="any"
              id="width"
              name="width"
              defaultValue={0}
              label="Largeur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="number"
              step="any"
              id="long"
              name="long"
              defaultValue={0}
              label="Longueur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="number"
              step="any"
              id="height"
              name="height"
              defaultValue={0}
              label="Hauteur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal" className="pb-4">
          <Form.Field>
            <Form.Input
              type="number"
              step="any"
              id="tickness"
              name="tickness"
              defaultValue={0}
              label="Epaisseur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="number"
              step="any"
              id="smallsides"
              name="smallsides"
              defaultValue={0}
              label="Petits cotés(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="number"
              step="any"
              id="arround"
              name="arround"
              defaultValue={0}
              label="Arrondis petits cotés(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="number"
              step="0.5"
              min="1.5"
              max="2"
              id="center"
              name="center"
              defaultValue={2}
              label="Centrer fermeture"
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>

        <Button type="submit" color="vk" content="Valider" />
        <div className="mt-20">
          {state.width > 0 ? (
            <Label content={format} attached="bottom" size="large" color="grey" className="text-center" />
          ) : null}
        </div>
      </Form>
    </div>
  );
}

export default App;
