import React from 'react';

//{name,entries}
//`${name}
//{entries}
const Rank = ({name, entries}) => {

   return(

   	<div>

      <div className='f3 white '>
        {`${name}, your image is...`}
      </div>

      <div className='f1 white'>
        {entries}
      </div>  
      
    </div>

   	)
}

export default Rank;
