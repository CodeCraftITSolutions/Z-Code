import React from "react";
import Header from "../../Sections/Header";
import SidebarAdmin from "../../Sections/SidebarAdmin";
import { Link } from "react-router-dom";

export default function AdminDashBoard() {
  return (
    <main className="w-full h-screen flex justify-between items-start">
      <SidebarAdmin  />
      <section className="w-4/5 grow bg-green-100 h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
        <Header bgColor="green"/>
        <div className="w-100 p-6 bg-green-200 rounded-xl shadow-lg flex flex-col items-center mt-20">
          <h1 className="text-3xl font-bold text-violet-700 mb-4">
            Welcome Admin!{" "}
          </h1>
          <div className="mb-6 flex flex-col items-center justify-center">
            <p className="text-green-900 text-lg mb-4">
              We're thrilled to have you here. This dashboard is your command
              center for effortlessly managing student and lecturer accounts,
              ensuring smooth operations within our educational ecosystem.
            </p>
            <div className="flex justify-center items-center gap-4">
              <Link to="/managelecturer">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
                Manage Lecturers
              </button>
              </Link>

              <Link to="/managestudent">
              <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                Manage Students
              </button>
              </Link>
          
            
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}