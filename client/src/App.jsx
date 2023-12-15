/* eslint-disable no-undef */
import './App.css';
import { Form, Button, Icon, Label, Radio, Checkbox } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
const HOST = 'localhost' || import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function App() {
  const [checked, setChecked] = useState(false);
  const [format, setFormat] = useState(null);
  const [state, setState] = useState({
    width: 0,
    long: 0,
    height: 0,
    tickness: 0.7,
    smallsides: 10,
    bottomside: 10,
    arround: 0,
    center: 2,
  });

  useEffect(() => {
    const maxWidth = checked
      ? state.width + state.bottomside * 2 + state.height * 2 + state.tickness * 2
      : state.width * 2 + state.bottomside + state.height * 2 + state.tickness * 2;
    const maxLong = state.long + state.height * 2 + state.smallsides * 2;
    setFormat(maxWidth + ' x ' + maxLong + 'cm');
  }, [state, checked]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://${HOST}:${PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    })
      .then((res) => {
        res.status == 200 ? console.log('Success: ', format) : console.log('error post data');
      })
      .catch((err) => console.log(err));

    //RESET
    setChecked(false);
    setState({
      width: 0,
      long: 0,
      height: 0,
      tickness: 0.7,
      smallsides: 10,
      bottomside: 10,
      arround: 0,
      center: 2,
    });

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
        link.setAttribute('download', `${state.width}x${state.long}x${state.height}cm.dxf`);

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
    <div className="w-full mx-auto px-40 h-screen max-h-screen bg-zinc-800 ">
      <div className="pb-10 pt-20">
        <h1 className="text-zinc-300 font-extralight uppercase tracking-widest text-center">
          Create B
          <Icon name="box" size="small" circular className="bg-amber-600 text-zinc-800" />x
        </h1>
      </div>

      <Form onSubmit={handleSubmit} className=" mx-auto bg-gray-600 rounded-md p-4">
        <Form.Group widths="equal" className="flex flex-col pb-6">
          <Form.Field className="pb-4">
            <Form.Input
              type="number"
              step="any"
              id="width"
              name="width"
              value={state.width}
              label="Largeur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field className="pb-4">
            <Form.Input
              type="number"
              step="any"
              id="long"
              name="long"
              value={state.long}
              label="Longueur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field className="pb-4">
            <Form.Input
              type="number"
              step="any"
              id="height"
              name="height"
              value={state.height}
              label="Hauteur(cm)"
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field className="pb-4">
            <Form.Input
              type="number"
              step="any"
              id="smallsides"
              name="smallsides"
              value={state.smallsides}
              label="Petits cotés(cm)"
              onChange={(e, data) => {
                setState({
                  ...state,
                  smallsides: parseFloat(data.value),
                  bottomside: checked ? state.width / 2 : parseFloat(data.value),
                });
              }}
            />
          </Form.Field>
        </Form.Group>

        <Label content="Options" ribbon color="brown" size="large" />
        <Form.Field width="4" className="pt-4">
          <Form.Input
            size="mini"
            type="number"
            step="any"
            id="arround"
            name="arround"
            label="Coins arrondis"
            value={state.arround}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Group inline className="py-4">
          <Form.Field>
            <Label className="w-auto mx-auto" content="Epaisseur carton:" size="large" color="red" />
          </Form.Field>
          <Form.Field>
            <Radio
              label="7mm"
              name="tickness"
              value={0.7}
              checked={state.tickness === 0.7}
              onChange={() => setState({ ...state, tickness: 0.7 })}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="3mm"
              name="tickness"
              value={state.tickness}
              checked={state.tickness === 0.3}
              onChange={() => setState({ ...state, tickness: 0.3 })}
            />
          </Form.Field>
        </Form.Group>

        <Form.Field className="pb-8">
          <Checkbox
            id="center"
            name="center"
            label="Centrer fermeture"
            onChange={(e, data) => {
              setChecked(data.checked);
              setState({
                ...state,
                center: data.checked ? 1.5 : 2,
                bottomside: data.checked ? state.width / 2 : state.smallsides,
              });
            }}
            checked={checked}
          />
        </Form.Field>

        <Form.Field>
          <Button type="submit" size="small" color="vk" content="Valider" />
        </Form.Field>
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
