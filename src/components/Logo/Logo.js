import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import brain from './brain.png'

const Logo = () => {

   return(

    <div className='ma4 mt1'>
     	<Tilt className="Tilt br2 shadow-3" options={{ max : 75 }} style={{ height: 125, width: 125 }} >
       		<div className="Tilt-inner pa3"> <img style={{paddingTop:'9px'}} alt='' src={brain} /> </div>
    	</Tilt>

    </div>

   	)
}

export default Logo;
