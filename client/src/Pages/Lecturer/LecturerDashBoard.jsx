import React from "react";
import { Link } from "react-router-dom";
const LecturerDashBoard = () => {
  return (
    <main className="w-full h-screen flex justify-between items-start text-xs md:text-base">
        <section className="w-4/5 grow bg-white h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
          <div className="w-100 p-6 bg-violet-100 rounded-xl shadow-lg flex flex-col items-center mt-20">
            <h1 className="text-xl md:text-2xl font-bold text-violet-700 mb-4">
              Welcome to your Dashboard!
            </h1>

            <div className="mb-6 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm md:text-base mb-4">
                Organize and create competitions to challenge your students and enhance their skills.
              </p>
              <div className="flex justify-center items-center gap-4">
                <Link to="/qbank">
                  <button className="bg-violet-500 text-white px-6 py-2 rounded-md hover:bg-violet-600 focus:outline-none">
                    Questions Bank
                  </button>
                </Link>
                <Link to="/contest">
                  <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                    Contests
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      
    </main>
  );
};

export default LecturerDashBoard;