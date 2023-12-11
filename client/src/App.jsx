/* eslint-disable no-undef */
import './App.css'
import { Input, Form, Button, Icon } from 'semantic-ui-react'
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function App() {

 const handleSubmit = (e) => {
  e.preventDefault()
   const form = e.target
   const formData = new FormData(form)
   const data = {
    largeur: formData.get('largeur'),
    longueur: formData.get('longueur'),
    hauteur: formData.get('hauteur'),
    marge: formData.get('marge'),
    ep: formData.get('ep'),
   }

     fetch(`http://${HOST}:${PORT}`,{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
   }).then((res) => {
    res.status == 200 ? console.log('Success') : console.log('error post data')
   }).catch(err => console.log(err))

 }
 
 return (
   <div className='mx-auto px-40'>
 
   <div className='text-center pb-8'>
   <h1 className="text-zinc-400 pt-8 pb-1">Create Box</h1>
     <Icon name='box' size='huge' color='orange' />
   </div>
 
 <Form onSubmit={handleSubmit} className='mx-auto content-center bg-slate-100 rounded-md p-4'>
  <Form.Group widths='equal' >
    <Form.Field id='largeur' name='largeur' defaultValue={0} control={Input} label="Largeur(cm)"/>
    <Form.Field id='longueur' name='longueur' defaultValue={0} control={Input} label="Longueur(cm)"/>
    <Form.Field id='hauteur' name='hauteur' defaultValue={0} control={Input} label="Hauteur(cm)"/>
  </Form.Group>
  <Form.Group widths='equal'>
    <Form.Field id='marge' name='marge' defaultValue={0} control={Input} label="Marge(cm)" className='max-w-xs'/>
    <Form.Field id='ep' name='ep' defaultValue={0} control={Input} label="Epaisseur(cm)" className='max-w-xs'/>
  </Form.Group>
  <Button type='submit' primary compact content='Valider' />
 </Form>
   </div>
  )
}

export default App
