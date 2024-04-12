import React, {useState} from 'react'

const StarRating = ({onChange}) => {
    const [rating, setRating] = useState(0); // Estado para almacenar la valoración actual
  
    const handleStarClick = (value) => {
      // Función para manejar el clic en una estrella
      setRating(value);
      onChange(value)
    };
  
    return (
        <div>
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`text-2xl cursor-pointer ${starValue <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
              onClick={() => handleStarClick(starValue)}
            >
              ★
            </span>
          ))}
        </div>
    );
  };
  
  export default StarRating;