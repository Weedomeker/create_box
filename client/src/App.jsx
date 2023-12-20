/* eslint-disable no-undef */
import isDev from 'isdev';
import './App.css';
import { Form, Button, Icon, Label, Radio, Checkbox } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
const URL = isDev ? 'localhost:4000' : import.meta.env.VITE_HOST;

function App() {
  const [render, setRender] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
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
    fetch(`http://${URL}/create_box`)
      .then((res) => {
        if (res.ok) {
          console.log('Le serveur est en ligne: ', res.status);
        } else {
          console.error('Le serveur a renvoyé une erreur: ', res.status);
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la tentative de connexion au serveur: ', err);
      });
  }, []);

  useEffect(() => {
    const maxWidth = checked
      ? state.width + state.bottomside * 2 + state.height * 2 + state.tickness * 2
      : state.width * 2 + state.bottomside + state.height * 2 + state.tickness * 2;
    const maxLong = state.long + state.height * 2 + state.smallsides * 2;
    setFormat(maxWidth + ' x ' + maxLong + 'cm');
  }, [state, checked]);

  const handleDownload = (e) => {
    e.preventDefault();
    const file = e.target.value;
    fetch(`http://${URL}/create_box/download/${file}`, {
      method: 'GET',
      headers: {
        'Content-Type': `application/${file}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${state.width}x${state.long}x${state.height}cm${state.center == 1.5 ? '_center' : ''}.${file}`,
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://${URL}/create_box`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log('Success: ', format);
          //SHOW download
          setShowDownload(true);
          //SHOW render
          setRender(
            `${parseFloat(state.width)}x${parseFloat(state.long)}x${parseFloat(state.height)}cm${
              state.center == 1.5 ? '_center' : ''
            }.svg`,
          );
        } else {
          console.log('error post data');
        }
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (e, { name, value }) => {
    setState({ ...state, [name]: parseFloat(value) });
    setShowDownload(false);
  };

  return (
    <div className="w-auto min-h-screen bg-zinc-800">
      <div className="pb-2 pt-4 md:pb-10 md:pt-20">
        <h1 className="text-zinc-300 font-extralight uppercase tracking-widest text-center">
          Create B
          <Icon name="box" size="small" circular className="bg-amber-600 text-zinc-800" />x
        </h1>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="h-full md:rounded-md  p-8 md:h-2/4 md:max-w-lg md:w-3/4 md:mx-auto  bg-gray-600 "
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

        <Form.Group inline>
          {showDownload && (
            <Form.Field>
              <Button
                type="button"
                size="mini"
                color="google plus"
                content="Download"
                value="dxf"
                onClick={handleDownload}
              />
            </Form.Field>
          )}
          {showDownload && (
            <Form.Field>
              <Button type="button" size="mini" color="linkedin" content="SVG" value="svg" onClick={handleDownload} />
            </Form.Field>
          )}
        </Form.Group>
      </Form>

      {render && (
        <div className="p-4 bg-zinc-900 md:h-fit md:max-w-screen-2xl md:w-3/4 md:mx-auto">
          <h4 className="text-white text-lg uppercase font-extralight tracking-widest">
            Rendu:{<p className="pb-4  text-xs text-zinc-500 lowercase">{render}</p>}
          </h4>

          <object
            width="auto"
            className="p-2 max-w-xs mx-auto md:max-h-full"
            data={encodeURI(`http://${URL}/create_box/public/${render}`)}
            type="image/svg+xml"
          ></object>
        </div>
      )}
    </div>
  );
}

export default App;
