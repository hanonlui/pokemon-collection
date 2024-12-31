import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const RandomPage = () => {
    const [pokemons, setPokemons] = useState([]);
    const [idFavorite, setIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [manualId, setManualId] = useState('');
    // const [ids] = useState([1, 2, 3, 4,5,6]);

    const [ids, setRanIds] = useState(() => {
        const randomIds = new Set();
        while (randomIds.size < 6) {
          randomIds.add(Math.floor(Math.random() * 151) + 1);
        }
        return [...randomIds].sort((a, b) => a - b); 
      });

    const handleAddId1 = () => {
        const randomIds = new Set();
        while (randomIds.size < 6) {
          randomIds.add(Math.floor(Math.random() * 151) + 1);
        }
        setRanIds([...randomIds].sort((a, b) => a - b)); 
      };
      const handleAddId2 = () => {
        const randomIds = new Set();
        while (randomIds.size < 6) {
          randomIds.add(Math.floor(Math.random() * 100) + 152);
        }
        setRanIds([...randomIds].sort((a, b) => a - b)); 
      };
    

    useEffect(() => {
        const storedIds = localStorage.getItem('idFavorite');
        if (storedIds) {
            setIds(JSON.parse(storedIds));
        }
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

    const handleImageClick_old = (id,name) => {
        if (window.confirm(`Are you sure you want to add [${name}] to your Favorite list?`)) {
        setIds(idFavorite => {
            if (idFavorite.includes(id)) {
                console.log("Included: "+id);
                return idFavorite.filter(item => item !== id);
            } else {
                console.log("Not Included: "+id);
                return [...idFavorite, id];
            }
        });  
        window.alert(`[${name}] is added to your Favorite list!!`);  
        }    
    };
    
    const handleImageClick = (id) => {
        setManualId(id);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

    const handleFormSubmit = async (pidInput, descriptionInput, ratingInput,ownsInput) => {
      try{
        const existingData = await fetch('http://localhost:5000/api/pokemonInfo').then(response => response.json());
        const isIdExists = existingData.some(item => item.pid == pidInput);
        if (isIdExists){
          alert('This pokemon already exists in your favourite list.');
          return;
         }
      } catch (err)
      {
        alert('Problem with the backend. Nothing is updated!');
        return;
      }
        
        const url = `http://localhost:5000/api/addPokemon`;

        const bodyData = {};
          if (pidInput !== '') {bodyData.pid = pidInput;}
          if (descriptionInput !== '') {bodyData.description = descriptionInput;}
          if (ratingInput !== '') {bodyData.rating = ratingInput;}
          if (ownsInput !== '') {bodyData.owns = ownsInput;}

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
              });
            //const data = await response.json();
            setIsModalOpen(false);
            window.alert(`Pokemon ID: [${pidInput}] is added to your Favorite list!!`); 
        } catch (err) {
            console.log(err);
            window.alert(`Input value invalid. Error: ${err}`); 
        }              
      };
    
    useEffect(() => {
        localStorage.setItem('idFavorite', JSON.stringify(idFavorite));
    }, [idFavorite])

    const items = JSON.parse(localStorage.getItem('idFavorite'));
    return ( 
        <>
        <h1>Random Team Generator</h1>
        <div><button onClick={handleAddId1}>Generation 1</button>&nbsp;&nbsp;&nbsp;
            <button onClick={handleAddId2}>Generation 2</button>
        </div>
        <p>Click Image to add to your Favorite Pokémon</p>       
        <div>
        <table className="table table-light table-striped table-bordered"><tbody>
            {pokemons.map((pokemon,i) => (
                <tr key={i}>
                    <td key={pokemon.id || i} style={{width: '150px'}} >
                        <img style={{width: '150px'}}
                            key={pokemon.id}
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            onClick={() => handleImageClick(pokemon.id,pokemon.name)}
                            className="img-fluid img-thumbnail"
                        />
                    </td>
                    <td style={{textAlign: 'left'}}>
                        <div>
                            <h4 style={{ textTransform : 'capitalize'}}>{pokemon.name}(ID: {pokemon.id})</h4>
                            Type: <span>&nbsp;</span>
                            {pokemon.types.map((type1,i) =>(  
                                <span style={{ textTransform : 'capitalize'}} key={i}>{type1.type.name}</span>
                            )).map((item,index)=>[index>0 &&", ",item])}
                            <br />Height: {pokemon.height/10}m
                            <br />Weight: {pokemon.weight/10}kg
                            <br /><span>&nbsp;</span>
                            {pokemon.stats.map((stat,i) =>(  
                                <span style={{ textTransform : 'capitalize'}} key={i}><b>{stat.stat.name}:</b>{stat.base_stat}&nbsp;</span>
                            ))}
                        </div>                      
                    </td>
                </tr>               
            ))}</tbody></table>
        
        </div>
        <div>
        <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Add Manual Data"
            style={{
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '5px'
            }
            }}>
            <form onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(e.target.id.value, e.target.description.value, e.target.rating.value, e.target.owns.value);}}>
                <div className="mb-3">
                    Pokemon ID: (You can change the ID)
                    <input type="text" className="form-control" id="id" placeholder="ID" value={manualId} onChange={(e) => setManualId(e.target.value)}/>
                </div>
                <div className="mb-3">
                    Your own Description for this pokemon: 
                    <input type="text" className="form-control" id="description" placeholder="e.g. I love this pokemon (Default = NA)" />
                </div>
                <div className="mb-3">
                    Your rating:
                    <input type="number" className="form-control" id="rating" placeholder="1-10 (Defalut = 5)" />
                </div>
                <div className="mb-3">
                    You have: 
                    <input type="number" className="form-control" id="owns" placeholder="How many you have now? (Max: 99, Defalut = 0)" />
                </div>
                <button type="submit">Add</button>
                <br /><br /><button onClick={handleCloseModal}>Close</button>                
            </form>
            </Modal>
            </div>
        </>
     );
}
  
export default RandomPage;