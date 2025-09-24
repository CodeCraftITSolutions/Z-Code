import React from 'react'
import { Link } from 'react-router-dom'

export default function ContestNavBar(props) {

    const {contestId,activeTab} = props;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
    <ul className="flex justify-center space-x-4">
      <li>
        <button
          onClick={() => props.showLeader()}
          className={`${
            activeTab ? 'bg-blue-400' : 'bg-blue-800'
          } hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition duration-300`}
        >
          Contest
        </button>
      </li>
      <li>
        <button
          onClick={() => props.showLeader()}
          className={`${
            !activeTab ? 'bg-blue-400' : 'bg-blue-800'
          } hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition duration-300`}
        >
          Leaderboard
        </button>
      </li>
    </ul>
  </div>
  )
}