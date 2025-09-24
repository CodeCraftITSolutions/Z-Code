import axios from 'axios'
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from './constant';

const API = axios.create({ 
    baseURL: 'https://emkc.org/api/v2/piston' ,
    withCredentials: false,
});


export const executeCode = async (sourceCode, language,input) => {
  
const response = await API.post('/execute', {
    language,
    version : LANGUAGE_VERSIONS[language],
    source: sourceCode,
    files :[ {
        "content" : sourceCode
    }],
    stdin: input
    
  })
  
  return response.data;
}

export const runCode = async (language,sourceCode) => {
  
    const response = await API.post('/execute', {
        language,
        version : LANGUAGE_VERSIONS[language],
        source: sourceCode,
        files :[ {
            "content" : sourceCode
        }],
        
      })
      
      return response.data;
    }