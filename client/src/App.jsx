/* eslint-disable no-undef */
import './App.css';
import { Form, Button, Icon, Label, Radio, Checkbox, Header } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
const HOST = import.meta.env.VITE_HOST;

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

    fetch(`https://${HOST}`, {
      method: 'POST',
      mode: 'cors',
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

    fetch(`https://${HOST}/download`, {
      method: 'GET',
      mode: 'cors',
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
    <div className="w-auto h-screen bg-zinc-800 ">
      <div className="pb-2 pt-4 md:pb-10 md:pt-20">
        <h1 className="text-zinc-300 font-extralight uppercase tracking-widest text-center">
          Create B
          <Icon name="box" size="small" circular className="bg-amber-600 text-zinc-800" />x
        </h1>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="h-full rounded-md p-8 md:h-2/4 md:max-w-lg md:w-fit md:mx-auto  bg-gray-600 "
      >
        <Form.Group widths="equal" className="flex flex-col pb-10 md:flex md:flex-col md:w-full md:pb-15">
          <Form.Field className="md:pb-4">
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
          <Form.Field>
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
          <Form.Field>
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
          <Form.Field>
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

        <Label
          content="Options"
          color="orange"
          size="large"
          className="w-full absolute left-0 right-0 z-10 text-center shadow-lg md:relative "
        />

        <Form.Field className="pt-12 md:pt-4">
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
        <Form.Group inline>
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

        <Form.Field className="pb-4">
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

        <Form.Group inline>
          <Form.Field>
            <Button type="submit" size="small" color="vk" content="Valider" />
          </Form.Field>
          <Form.Field inline className="">
            {state.width > 0 ? <Label content={format} size="large" color="brown" className="text-center " /> : null}
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  );
}

export default App;
