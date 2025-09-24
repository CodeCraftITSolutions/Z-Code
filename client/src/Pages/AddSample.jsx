import React from 'react'
import { useState } from 'react'
import { backendUrl } from '../../config';

export default function AddSample() {

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const[err,setErr] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${backendUrl}/api/sample`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,age})
        });
        const json = await response.json();
        if(!response.ok){
            setErr(json.error);
        }
        if(response.ok){
            setErr('');
            setName('');
            setAge('');
            setErr(json.msg);
        }

    }

  return (
    <div>
        <form onSubmit={handleSubmit} >
        <label htmlFor="name">Name:</label>
        <input value={name} type="text" id="name" name="name" onChange={(e)=>{setName(e.target.value)}}></input>
        <label htmlFor="age">Age:</label>
        <input  value= {age} type="number" id="age" name="age"  onChange={(e)=>{setAge(e.target.value)}}></input>
        
        <button>Submit</button>
        </form>

        <p>{name}</p>
        <p>{age}</p>

        {err && <p>{err}</p>}
      
    </div>
  )
}