import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [pokemons, setPokemons] = useState([]);
    // const [ids] = useState([1, 2, 3, 4,5,6]);
    const [ids] = useState(() => {
        const randomIds = new Set();
        while (randomIds.size < 5) {
          randomIds.add(Math.floor(Math.random() * 1025) + 1);
        }
        return [...randomIds].sort((a, b) => a - b);
      });

    useEffect(() => {
        const fetchData = async () => {
          const fetchedData = await Promise.all(
            ids.map(async (id) => {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
              const data = await response.json();
              return data;
            })
          );
          setPokemons(fetchedData);
        };
      
        fetchData();
      }, [ids]);

      // console.log(pokemons);
    return (
    <div>
      <h1>Your Lucky Pokémon in All generation</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} style={{ border: '2px solid #ccc', padding: '5px', width: '160px', textAlign: 'center' }}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '100%' }} />
            <h3 style={{ textTransform : 'capitalize'}}>{pokemon.name}</h3>
            <p> Type: <span>&nbsp;</span>
            {pokemon.types.map((type1,i) =>(  
                <span key={i}>{type1.type.name}</span>
            )).map((item,index)=>[index>0 &&", ",item])}
            </p>
            ID: {pokemon.id}
          </div>
        ))}
      </div>
    </div>
    );
}
 
export default HomePage;