import React from 'react'
import { LANGUAGE_VERSIONS } from '../../constant.js'

const Languages = Object.entries(LANGUAGE_VERSIONS)

export default function LanguageSelector(props) {
  const{language,onSelect} = props;
  return (
    <div>
      <select value={language} onChange={(e)=>onSelect(e.target.value)} name=""  id="">
       
        {Languages.map(([language, version]) => (
          <option key={language} value={language}>
            {language}
            &nbsp;
            
            
            ({version})
            
          </option>
        ))}
        </select>

        <p>
            
        </p>


    </div>
  )
}