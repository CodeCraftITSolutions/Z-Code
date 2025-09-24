import React from 'react';
import { Editor } from '@monaco-editor/react';

const DetailedSubmission = ({ submission, onClose }) => {
  return (
    <div className="p-6 font-sans">
      <h2 className="text-xl font-bold mb-4">Detailed Results</h2>
      <div className="mb-4">
        <p className="font-semibold">Language: {submission.language}</p>
      </div>
      <div className="mb-4">
        <Editor
          height="20vh"
          theme="vs-dark"
          value={submission.code}
          language={submission.language}
          options={{ readOnly: true, scrollBeyondLastLine: false }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-center">Input</th>
              <th className="px-4 py-2 border-b text-center">Expected Output</th>
              <th className="px-4 py-2 border-b text-center">Output</th>
              <th className="px-4 py-2 border-b text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            {submission.results.map((result, index) => (
              <tr key={index} className="bg-gray-50">
                <td className="px-4 py-2 border-b text-center">
                  <textarea
                    className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md p-2"
                    readOnly
                    value={result.input}
                  />
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <textarea
                    className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md p-2"
                    readOnly
                    value={result.expectedOutput}
                  />
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <textarea
                    className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md p-2"
                    readOnly
                    value={result.output}
                  />
                </td>
                <td className="px-4 py-2 border-b text-center text-red-500">
                  {result.result === '✅' ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default DetailedSubmission;