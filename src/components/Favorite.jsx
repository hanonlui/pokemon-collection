import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { API_BASE_URL } from '../config'; 

const FavoritePage = () => {
    const [pokemons, setPokemons] = useState([]);
    // const [idFavorite, setIds] = useState([]);
    // const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [pokemonsFromBackend, setPokemonsBackend] = useState([]);
    const [manualId, setManualId] = useState('');

    const fetchBackendApiData = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/pokemonInfo`);
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error fetching data:', err);
        return [
          { pid: 94, description: "This is dummy", owns: 1, rating: 10 },
          { pid: 36, description: "This is dummy 2", owns: 1, rating: 10 },
          // Add more dummy objects as needed
        ]
      }
        
    };
    const fetchPublicApiData = async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return data;
    };
    const fetchDataAndMerge = async () => {
        const firstApiData = await fetchBackendApiData();
        const promises = firstApiData.map(item => {
          return fetchPublicApiData(item.pid).then(secondApiData => ({
            ...item,
            ...secondApiData
          }));
        });
        const mergedData = await Promise.all(promises);
        mergedData.sort((a, b) => a.pid - b.pid);
        return mergedData;
    };
    useEffect(() => {
        fetchDataAndMerge().then(mergedData => {
            setPokemonsBackend(mergedData);
            setPokemons(mergedData);
        });
      }, []);

    // const handleInputChange = (event) => {
    //     setInputValue(event.target.value);
    //   };
    // const handleAddId = () => {
    //     const newId = parseInt(inputValue);
    //     if (!isNaN(newId) && !idFavorite.includes(newId)) {
    //     setIds([...idFavorite, newId]);
    //     setInputValue(''); 
    //     window.location.reload();
    //     }
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //     const storedIds = localStorage.getItem('idFavorite');
    //     if (storedIds) {
    //         setIds(JSON.parse(storedIds));
    //     }
    //     var ids = storedIds ? JSON.parse(storedIds) : [];
    //     ids = [...ids].sort((a, b) => a - b);
    //       const fetchedData = await Promise.all(
    //         ids.map(async (id) => {
    //           const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    //           const data = await response.json();
    //           return data;
    //         })
    //       );
    //       setPokemons(fetchedData);
    //     };
        
    //     fetchData();
    //   }, []);

    //   const handleImageClick_old = (id,name) => {
    //     if (window.confirm(`Are you sure you want to delete [${name}]?`) && idFavorite.includes(id)) {
    //         setIds(idFavorite => {
    //             if (idFavorite.includes(id)) {
    //                 console.log("Included: "+id);
    //                 return idFavorite.filter(item => item !== id);
    //             }
    //         });    
    //         window.location.reload();
    //     }
    // };

    const handleImageClick = async (pid,name) => {
        if (!window.confirm(`Are you sure you want to delete [${name}]?`) ) {
            return;
        }

        
        try{
          const existingData = await fetch(`${API_BASE_URL}/pokemonInfo`).then(response => response.json());
          const _id = existingData.find(item => item.pid === pid)?._id;
          console.log(_id);
          const response = await fetch(`${API_BASE_URL}/deletePokemon/${_id}`, {
          method: 'DELETE'
            });
          if(response.status === 200){
            const newPokemon = pokemons.filter((pokemon) => pokemon._id !== _id);
            setPokemons(newPokemon);
          } else {
            console.log("Delete unsuccessful!!");
          }
        } catch (err){
          console.log(`error!! ${err}`)
        }

        window.location.reload();
    };

    // useEffect(() => {
    //     localStorage.setItem('idFavorite', JSON.stringify(idFavorite));
    // }, [idFavorite])

    const handleBtnClick = (id) => {
        setManualId(id);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      const handleFormSubmit = async (pid, descriptionInput, ratingInput,ownsInput) => {
    
        let _id = '';
        try{
          const existingData = await fetch(`${API_BASE_URL}/pokemonInfo`).then(response => response.json());
          const isIdExists = existingData.some(item => item.pid == pid);
          _id = existingData.find(item => item.pid == pid)?._id;
          if (!isIdExists){
              alert('This pokemon does not exists in your favourite list.');
              return;
          }          
        } catch (err){
          alert('Problem with the backend. Nothing is updated!');
          return;
        }

        const url = `${API_BASE_URL}/updatePokemon/${_id}`;

        const bodyData = {};
          if (descriptionInput !== '') {bodyData.description = descriptionInput;}
          if (ratingInput !== '') {bodyData.rating = ratingInput;}
          if (ownsInput !== '') {bodyData.owns = ownsInput;}

        try{
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
              });
            setIsModalOpen(false);
            window.location.reload();
            window.alert(`Pokemon ID: [${pid}] is updated!`); 
        } catch (err) {
            console.log(err);
            window.alert(`Input value invalid. Error: ${err}`); 
        }              
      };

    return (
        <>
        <h1>My Favorite Pokémon</h1>
        <p>Click Image to delete from your Favorite Pokémon</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {pokemonsFromBackend.map((pokemon,i) => (
                     
            <div key={i} style={{ border: '2px solid #ccc', padding: '5px', width: '180px', textAlign: 'center' }}>
            <h5 style={{ textTransform : 'capitalize'}}>{pokemon.name}(ID: {pokemon.id})</h5>
            <b>Type:</b> <span>&nbsp;</span>
                            {pokemon.types.map((type1,i) =>(  
                                <span style={{ textTransform : 'capitalize'}} key={i}>{type1.type.name}</span>
                            )).map((item,index)=>[index>0 &&", ",item])}
            <br /><b>Desc:</b> {pokemon.description}
            <br /><b>Rating:</b> {pokemon.rating}
            <br /><b>Qty:</b> {pokemon.owns} <span>&nbsp;</span>
            <button className="btn btn-outline-info btn-sm" onClick={() => handleBtnClick(pokemon.id,pokemon.name)}>Update</button>
            <img style={{width: '100%', verticalAlign: 'bottom'}}
            key={pokemon.id}      
            src={pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default']}            
            alt={pokemon.name}
            onClick={() => handleImageClick(pokemon.id,pokemon.name)}
            className="img-fluid img-thumbnail"
            />
            </div>            
                     
        ))}
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
                    Pokemon ID:
                    <input type="text" className="form-control" id="id" placeholder="ID" value={manualId} disabled/>
                </div>
                <div className="mb-3">
                    Your own Description for this pokemon: 
                    <input type="text" className="form-control" id="description" placeholder="e.g. I love this pokemon" />
                </div>
                <div className="mb-3">
                    Your rating:
                    <input type="number" className="form-control" id="rating" placeholder="1-10" />
                </div>
                <div className="mb-3">
                    You have: 
                    <input type="number" className="form-control" id="owns" placeholder="How many you have right now? (max: 99)" />
                </div>
                <button type="submit">Update</button>
                <br /><br /><button onClick={handleCloseModal}>Close</button>                
            </form>
            </Modal>
            </div>
    {/* <br />
    <div>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button onClick={handleAddId}>Add by ID</button>
    </div> */}
    </>
     );
}
 
export default FavoritePage;