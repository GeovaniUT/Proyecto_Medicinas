import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCoffee, faMoon, faBed, faPills } from '@fortawesome/free-solid-svg-icons';
import './tabla.css';


function Tabla() {


    const [dosis, setDosis] = useState([])
    const [tiempo, setTiempo] = useState(0)
    const [fecha, setFecha] = useState([])
    const [comentarios, setComentarios] = useState([])


    const handleTiempoChange = event => {
      const tiempoValue = event.target.value;
      console.log("Nuevo valor de tiempo:", tiempoValue);
      setTiempo(tiempoValue);
    };

  const [tabla, setTabla] = useState([1,2,3,4])
  const [medicamentos, setMedicamentos] = useState([
    {
      
      tiempo: "Morning",
      icon: <FontAwesomeIcon icon={faSun} /> ,  
      className: "red"
    },
    {
      tiempo: "Noon",
      icon:<FontAwesomeIcon icon={faCoffee} />,  
      className: "yellow"
    },
    {
      tiempo: "Evening",
      icon: <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>,
      className: "blue"
    },
    {
      tiempo: "Night",
      icon: <FontAwesomeIcon icon={faBed} />,
      className: "purple"
    },
    {
      tiempo: "Only when i need it",
      icon: <FontAwesomeIcon icon={faPills} />,
      className:"green"
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
        
      })
      .catch(error => console.error('Error fetching data:', error));

  },[...recetas])
  

   
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
      console.log("hola")
  },[]);

  const handleSelectChange = event => {
    setSelectedMedicina(event.target.value);
  };

  const handleGuardarMedicina = () => {
    
    // useEffect(()=>{

    // })
    fetch('http://localhost:8082/registrarReceta',{
      method:'POST',
      body: JSON.stringify({
        "medicina_id": selectedMedicina,
        "dosis": dosis,
        "tiempo": tiempo,
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

    setShowModal(false)

  };

  const tomarPastilla = async (id_medicamento, tiempo) => {
    try {
      const response = await fetch(`http://localhost:8082/actualizarHora`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_medicamento: id_medicamento,
          tiempo: tiempo
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar la fecha. Código de estado: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Actualiza el estado local (recetas) después de tomar la pastilla
      setRecetas(prevRecetas => prevRecetas.map(receta =>
        receta.id_medicamento === id_medicamento
          ? { ...receta, tiempo: tiempo }
          : receta
      ));
    } catch (error) {
      console.error("Error al actualizar la fecha:", error.message);
    }
  };

const Terminar = async(id_medicamento) => {
  try {
      const response = await fetch(`http://localhost:8082/eliminarReceta`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id_medicamento: id_medicamento,
          }),
      });

      if (!response.ok) {
          throw new Error(`Error al eliminar. Código de estado: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Actualizar el estado local (recetas) después de la eliminación
      setRecetas((prevRecetas) => {
          // Filtrar las recetas para excluir la receta eliminada
          return prevRecetas.filter((receta) => receta.id_medicamento !== id_medicamento);
      });
  } catch (error) {
      console.error("Error al eliminar la receta:", error.message);
  }
};


  const getMedicamento = (categoria, index) => {

      const recetasPorCategoria = recetas.filter(item => item.hora === categoria.tiempo)

      if(recetasPorCategoria[index] !== undefined){
        return <>
          <td className='celda border'>{recetasPorCategoria[index].nombre_medicina}</td>
          <td className='celda border'>{recetasPorCategoria[index].dosis}</td>
          <td className='celda border'>{recetasPorCategoria[index].tiempo}</td>
          <td className='celda border'>{recetasPorCategoria[index].horaNueva}</td>
          <td className='celda border'>{recetasPorCategoria[index].comentarios}</td>
      
          <button className='TomarPastilla' onClick={() => tomarPastilla(recetasPorCategoria[index].id_medicamento,recetasPorCategoria[index].tiempo)}>Tomar</button>
          <button className='Terminar' onClick={()=>Terminar(recetasPorCategoria[index].id_medicamento)}>Terminar</button>
          
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
              <table className={`table-style ${categoria.className}`} >
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
                  <tr key={index} >
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
                    <label htmlFor="tiempo">Tiempo:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="tiempo"
                      required
                      onChange={handleTiempoChange}
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
