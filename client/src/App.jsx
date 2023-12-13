/* eslint-disable no-undef */
import './App.css'
import { Input, Form, Button, Icon, Label } from 'semantic-ui-react'
import {useState} from 'react'
const HOST = 'localhost' || import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function App() {

  const [format, setFormat] = useState(null)

 const handleSubmit = (e) => {
  e.preventDefault()
   const form = e.target
   const formData = new FormData(form)
   const data = {
    width: formData.get('width'),
    long: formData.get('long'),
    height: formData.get('height'),
    tickness: formData.get('tickness'),
    smallsides: formData.get('smallsides'),
    arround: formData.get('arround'),
   }

  
   
     fetch(`http://${HOST}:${PORT}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
   }).then((res) => {
    res.status == 200 ? console.log('Success') : console.log('error post data')
   }).catch(err => console.log(err))

   form.reset()
   fetch(`http://${HOST}:${PORT}/download`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/dxf',
    },
  })
  .then((response) => response.blob())
  .then((blob) => {
    // Create blob link to download
    const url = window.URL.createObjectURL(
      new Blob([blob]),
    );
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

 }
 
 return (
   <div className='mx-auto px-40'>
 
   <div className='text-center pb-8'>
   <h1 className="text-zinc-400 pt-8 pb-1">Create Box</h1>
     <Icon name='box' size='huge' color='orange' />
   </div>
 
 <Form onSubmit={handleSubmit} className='mx-auto content-center bg-slate-100 rounded-md p-4'>
  <Form.Group widths='equal'>
    <Form.Field className='mx-auto max-w-xs'>
    <Input type='number' id='width' name='width' defaultValue={0} label="Largeur(cm)"/>
    <Input type='number' id='long' name='long' defaultValue={0} label="Longueur(cm)"/>
    <Input type='number' id='height' name='height' defaultValue={0} label="Hauteur(cm)"/>
    </Form.Field>
  </Form.Group>
  <Form.Group widths='equal' >
    <Form.Field inline>
    <Input id='tickness' name='tickness' defaultValue={0} label="Epaisseur(cm)" className='max-w-xs'/>
    <Input type='number' id='smallsides' name='smallsides' defaultValue={0} label="Petits cotés(cm)" className='max-w-xs'/>
    <Input id='arround' name='arround' defaultValue={0} label="Arrondis petits cotés(cm)" className='max-w-xs'/>
    </Form.Field>
  </Form.Group>
  <Button type='submit' primary compact content='Valider' />
  <Label content={format}/>
 </Form>
   </div>
  )
}

export default App
