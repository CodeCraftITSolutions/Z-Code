import React, { useState } from 'react';
import LogoImage from '../assets/Images/logo.jpg';
import { FaBars, FaTimes } from 'react-icons/fa';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    let Links = [
        {
            name: 'Home',
            link: '/'
        },
        {
            name: 'SignUp',
            link: '/signup'
        },
        {
            name: 'Contact Us',
            link: '/contactus'
        }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    return (
        <div className='shadow-md w-full fixed top-0 left-0'>
            <div className='md:flex items-center justify-between bg-white py-4 md:px-10 px-7 '>
                <div className='font-bold hover:font-signature  text-2xl cursor-pointer flex items-center text-gray-800 '>
                    <img className='w-16 h-16 ' src={LogoImage} alt="logo" />
                    Z-CODE
                </div>
                <div className='text-3xl absolute right-8 top-6 cursor-pointer'>
                    {isMenuOpen ? (
                        <FaTimes 
                            className='text-3xl md:hidden block transition duration-300 transform hover:scale-110'
                            onClick={toggleMenu} 
                        />
                    ) : (
                        <FaBars 
                            className='text-3xl md:hidden block transition duration-300 transform hover:scale-110'
                            onClick={toggleMenu} 
                        />
                    )}
                </div>
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${isMenuOpen ? '' : 'hidden'}`}>
                    {Links.map((link) => (
                        <li key={link.name} className='md:ml-8 text-xl md:my-0 my-7'>
                            <a href={link.link}className='text-gray-800 hover:text-gray-400 duration-500'>{link.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Navbar;