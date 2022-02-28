import React from 'react'
import NavBar from './NavBar';
import footer from './footer';

 const Layout = (props) => {
    return (
        <div>
            <NavBar/>
            {props.children}
        </div>
        <div>
            <footer/>
        </div>
     
    )
}

export default Layout;
