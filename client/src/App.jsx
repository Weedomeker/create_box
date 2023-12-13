/* eslint-disable no-undef */
import './App.css'
import { Input, Form, Button, Icon } from 'semantic-ui-react'
const HOST = 'localhost' || import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function App() {

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
   }

     fetch(`http://${HOST}:${PORT}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
   }).then((res) => {
    res.status == 200 ? console.log('Success') : console.log('error post data')
   }).catch(err => console.log(err))

   form.reset()

 }
 
 return (
   <div className='mx-auto px-40'>
 
   <div className='text-center pb-8'>
   <h1 className="text-zinc-400 pt-8 pb-1">Create Box</h1>
     <Icon name='box' size='huge' color='orange' />
   </div>
 
 <Form onSubmit={handleSubmit} className='mx-auto content-center bg-slate-100 rounded-md p-4'>
  <Form.Group widths='equal' >
    <Form.Field type='number' id='width' name='width' defaultValue={0} control={Input} label="Largeur (cm)"/>
    <Form.Field type='number' id='long' name='long' defaultValue={0} control={Input} label="Longueur (cm)"/>
    <Form.Field type='number' id='height' name='height' defaultValue={0} control={Input} label="Hauteur (cm)"/>
  </Form.Group>
  <Form.Group widths='equal'>
    <Form.Field id='tickness' name='tickness' defaultValue={0} control={Input} label="Epaisseur (cm)" className='max-w-xs'/>
    <Form.Field type='number' id='smallsides' name='smallsides' defaultValue={0} control={Input} label="Petits cotés (cm)" className='max-w-xs'/>
  </Form.Group>
  <Button type='submit' primary compact content='Valider' />
 </Form>
   </div>
  )
}

export default App
