import { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = (e) => {
        // Prevent default to stop Link from triggering navigation
        e.preventDefault();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (  
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/pokemon-collection/">Pokémon Collection</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerRight" aria-controls="navbarTogglerRight" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerRight">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home <span className="sr-only"></span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/favorite">Favorite</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/random">Random Team</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact Message</Link>
                    </li>
                </ul>
            </div>
        </nav>

    );
}
 
export default NavBar;