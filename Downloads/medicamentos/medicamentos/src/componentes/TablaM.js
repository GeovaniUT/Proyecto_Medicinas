import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCoffee, faMoon, faBed, faPills } from '@fortawesome/free-solid-svg-icons';
import './tabla.css';
import { json } from 'react-router-dom';


function Tabla() {


    const [dosis, setDosis] = useState([])
    const [tiempo, setTiempo] = useState([])
    const [fecha, setFecha] = useState([])
    const [comentarios, setComentarios] = useState([])


 

  const [tabla, setTabla] = useState([1,2,3,4])
  const [medicamentos, setMedicamentos] = useState([
    {
      
      tiempo: "Morning",
      icon: <FontAwesomeIcon icon={faSun} /> ,   
    },
    {
      tiempo: "Noon",
      icon:<FontAwesomeIcon icon={faCoffee} />,  
    },
    {
      tiempo: "Evening",
      icon: <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
    },
    {
      tiempo: "Night",
      icon: <FontAwesomeIcon icon={faBed} />
    },
    {
      tiempo: "Only when i need it",
      icon: <FontAwesomeIcon icon={faPills} />
    }
  ])

  const [recetas, setRecetas] = useState([])

  useEffect(()=>{

    fetch('http://localhost:8082/obtenerRecetas',{
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      }
      }) 

      .then(response => response.json())
      .then(data => {
        setRecetas(data.Recetas)
        console.log(data.Recetas)
      })
      .catch(error => console.error('Error fetching data:', error));

  },[])
  

   
  const [buttonTop, setButtonTop] = useState(0);
  const [showModal, setShowModal] = useState(false);

  function agregarMedicina() {
    setShowModal(true);
    
  }

 
const [medicinas, setMedicinas] = useState([]);
  const [selectedMedicina, setSelectedMedicina] = useState('');

  useEffect(() => {

    fetch('http://localhost:8082/obtenerMedicina', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setMedicinas(data.medicina))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSelectChange = event => {
    setSelectedMedicina(event.target.value);
  };

  const handleGuardarMedicina = () => {
    
    fetch('http://localhost:8082/registrarReceta',{
      method:'POST',
      body: JSON.stringify({
        "medicina_id": selectedMedicina,
        "dosis": dosis,
        "tiempo": tiempo,
        "fecha":fecha,
        "comentarios":comentarios,
        

      }),
      headers:{
        'Content-Type': 'application/json'
      }
      
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta de la API:', data);
     
    })
    .catch(error => console.error('Error al registrar receta:', error));

    // setTabla(tabla => {
    //   return tabla.map(item => ({ ...item, medicina: selectedMedicina }));
    // });

    setShowModal(false);
    
    
  };

  const tomarPastilla = async (id_medicamento) => {
    try {
        const response = await fetch(`http://localhost:8082/actualizarHora`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_medicamento: id_medicamento,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la fecha. Código de estado: ${response.status}`);
        }

        const data = await response.json();
        console.log("Respuesta del servidor:", data);
    } catch (error) {
        console.error("Error al actualizar la fecha:", error.message);
    }
};


  const getMedicamento = (categoria, index) => {

    const recetasPorCategoria = recetas.filter(item => item.hora === categoria.tiempo)

    if(recetasPorCategoria[index] !== undefined){
      return <>
        <td className='celda border'>{recetasPorCategoria[index].nombre_medicina}</td>
        <td className='celda border'>{recetasPorCategoria[index].dosis}</td>
        <td className='celda border'>{recetasPorCategoria[index].tiempo}</td>
        <td className='celda border'>{recetasPorCategoria[index].fecha}</td>
        <td className='celda border'>{recetasPorCategoria[index].comentarios}</td>
    
        <button className='TomarPastilla' onClick={() => tomarPastilla(recetasPorCategoria[index].id_medicamento)}>Tomar</button>
        
      </>
    }
    

    return  <>
    <td className='celda border'></td>
    <td className='celda border'></td>
    <td className='celda border'></td>
    <td className='celda border'></td>
    <td className='celda border'></td>



    
    </>
  }

   return (
    <>
      <h1 className="text-6xl text-center font-bold text-teal-500 title">CUADRO DE MEDICAMENTOS</h1>
      
      <button className="btn btn-primary" onClick={agregarMedicina}>Agregar Medicina</button>
          <div className='contenedor'>
          {
            medicamentos.map((categoria, posicion)=>(
              <table className='table-style' >
                {
                  posicion === 0 && (
                    <tr>
                    <th></th>
                    <th className='column'>Medicamentos</th>
                    <th className='column'>Dosis</th>
                    <th className='column'>Tiempo</th>
                    <th className='column'>Fecha</th>
                    <th className='column'>Comentarios</th>
                </tr>
                  )
                }
              
              {
                tabla.map((_, index)=>(           
                  <tr key={index}>
                    {
                        index === 0 && (
                          <td rowSpan={4} className={`columan-fija icons ${categoria.tiempo.toLowerCase()}`}>
                              <div className='icons'>
                                    <p className='text'>{categoria.tiempo}</p>
                                    <div>{categoria.icon}</div>
                                    
                              </div>
                              
                          </td>
                        )
                    } 

                    {getMedicamento(categoria, index)}
                  </tr>
                ))
              }
        </table>
            ))
          }    
          <div className="button-container text-center">
        
      </div>

              {/* Modal para ingresar información de la medicina */}
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? "block" : "none" }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ingrese la información de la medicina</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
              <label htmlFor="medicina">Medicina:</label>
              <select class="form-select" aria-label="Default select example" value={selectedMedicina} onChange={handleSelectChange}>
                <option selected>Seleccione una medicina</option>
              {medicinas.map(medicina => (
                <option key={medicina.id_medicina} value={medicina.id_medicina}>
                    {medicina.medicina}
                </option>
              ))}
    </select>
                <div className="form-group">
                  <label htmlFor="dosis">Dosis:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="dosis"
                    required
                    onChange={e => setDosis(e.target.value)}
                  />
                </div>
                <div className="form-group">
                    <label htmlFor="tiempo">Tiempo(Días):</label>
                    <input
                      type="number"
                      className="form-control"
                      id="tiempo"
                      required
                      onChange={e => setTiempo(e.target.value)}
                    />
                  </div>
                <div className="form-group">
                  <label htmlFor="fecha">Fecha:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fecha"
                    required
                    onChange={e => setFecha(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="comentarios">Comentarios:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="comentarios"
                    onChange={e => setComentarios(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleGuardarMedicina}>
                Guardar Medicina
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  

          

    </>
  );
}

export default Tabla;
