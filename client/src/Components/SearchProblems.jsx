import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { backendUrl } from '../../config';

const SearchProblems = () => {
    const [name, setName] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/problems/search`, {
                params: { name }
            });
            setResults(response.data);
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Search Problems</h1>
        <div className="flex flex-col space-y-4">
            <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
        <ul className="mt-6 space-y-4">
            {results.map(problem => (
                <li key={problem._id} className="border-b border-gray-200 pb-2">
                    <Link
                        to={`/problems/${problem._id}`}
                        className="text-blue-500 hover:underline text-lg"
                    >
                        {problem.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default SearchProblems;