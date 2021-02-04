import React from 'react';

const Card = ({imageSource,id}) => {
    return (
        <div>
            <img src={imageSource} alt={id} />
        </div>
        
    )
};

export default Card;