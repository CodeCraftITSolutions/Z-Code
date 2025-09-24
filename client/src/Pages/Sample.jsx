import React, { useEffect,useState } from 'react'
import { backendUrl } from '../../config';

export default function Sample() {

    const [samples, setSamples] = useState([]);

    useEffect(()=>{
        const fetchSamples = async () => {
            const response = await fetch(`${backendUrl}/api/sample`);
            const data = await response.json();
            if(response.ok){
                setSamples(data.samples);
            }

        }
        fetchSamples();
    },[])

  return (
    <div>

        <table>
          
            <tr>
                <th>Name</th>
                <th>Age</th>
            </tr>

           
            {samples && samples.map(sample => (
          <tr key={sample._id}>
              <td>{sample.name}</td>
              <td>{sample.age}</td>
          </tr>
      ))}
               

        

        </table>

   
    </div>
  )
}