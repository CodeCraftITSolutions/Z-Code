import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NavbarSubmission = (props) => {

    const { handleNavigation,viewSubmission } = props;

  

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <ul className="flex space-x-8">
                    <li>
                        <NavLink

                            onClick={() => handleNavigation('problem')}
                            className={`inline-block py-4 px-4 text-gray-600 hover:text-blue-500 ${!viewSubmission ? 'border-b-2 border-blue-500 font-bold' : ''
                                }`}
                        >
                            Problem
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            onClick={() => handleNavigation('submission')}
                            className={`inline-block py-4 px-4 text-gray-600 hover:text-blue-500 ${viewSubmission ? 'border-b-2 border-blue-500 font-bold' : ''
                                }`}
                        >
                            Submissions
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavbarSubmission;