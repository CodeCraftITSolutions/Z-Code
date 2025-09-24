import React from 'react'
import Sidebar from '../Sections/Sidebar'
import Header from '../Sections/Header'

export default function Practice() {
  return (
    <main className="w-full h-screen flex justify-between items-start">
    <Sidebar />
    <section className="w-4/5 grow bg-blue-100 h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
      <Header />
      <div className="w-5/6 p-6 bg-blue-400 rounded-xl shadow-lg flex flex-col items-center mt-20">
        <h2 className="text-xl font-semibold mb-4 text-blue-950">
          Problems
        </h2>
        <table className="w-full">
          <thead>
            <tr className="bg-blue-200">
              <th className="px-6 py-3 text-left text-blue-800">Name</th>
              <th className="px-6 py-3 text-left text-blue-800">Difficulity</th>
              <th className="px-6 py-3 text-left text-blue-800">Category</th>
            </tr>
          </thead>
 
        </table>
      </div>
    </section>
  </main>
  )
}