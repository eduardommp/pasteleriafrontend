import { useContext, useState,useEffect } from "react";
import { RegistroContext } from "./Contexto";

import axios from 'axios';


function Paso2() {
  const { pasoActual, setPasoActual } = useContext(RegistroContext);

  const [categoria, setCategoria] = useState("");

  const [formularioVisible, setFormularioVisible] = useState(false);
  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    nombre: "",
    cantidad: "",
    idMedida: "",
  });
  const [ingredientes, setIngredientes] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(
    []
  );

  const manejarCambioCategoria = (event, newValue) => {
    if (newValue) {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, newValue]);
      setCategoria("");
    }
  };

  const eliminarCategoria = (categoria) => {
    setCategoriasSeleccionadas(
      categoriasSeleccionadas.filter((cat) => cat !== categoria)
    );
  };

  const manejarCambioNuevoIngrediente = (event) => {
    setNuevoIngrediente({
      ...nuevoIngrediente,
      [event.target.name]: event.target.value,
    });
  };

  const agregarIngrediente = () => {
    guardarIngrediente();
    setNuevoIngrediente({ nombre: "", cantidad: "", idMedida: "" });
    setFormularioVisible(false);
  };

  const manejarCambioIngrediente = (event, newValue) => {
    if (newValue) {
      setIngredientesSeleccionados([...ingredientesSeleccionados, newValue]);
      setIngredienteSeleccionado(null);
    }
  };

  const eliminarIngrediente = (ingrediente) => {
    setIngredientesSeleccionados(
      ingredientesSeleccionados.filter((ing) => ing !== ingrediente)
    );
  };


  useEffect(() => {
    axios.get('http://127.0.0.1:8000/categorias')
      .then(response => {
        const nombres = response.data.map(categoria => categoria.nombre);
        console.log(nombres);
        setCategorias(nombres);
      });
  }, []);

  useEffect(() => {
    recuperarIngredientesApi();
  }, []);

  function recuperarIngredientesApi() {
    axios.get('http://127.0.0.1:8000/ingredientes')
      .then(response => {
        console.log(response.data);
        setIngredientes(response.data);
      });
  }

  function guardarIngrediente() {
    axios.post('http://127.0.0.1:8000/ingrediente',
      {
        nombre: nuevoIngrediente.nombre,
        cantidad: nuevoIngrediente.cantidad,
        idMedida: nuevoIngrediente.idMedida
      })
      .then(response => {
        console.log(response.data);
        recuperarIngredientesApi();
      });
    }


  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-700">Categorias</h1>
        <FormControl fullWidth className="mb-4">
          <Autocomplete
            value={categoria}
            onChange={manejarCambioCategoria}
            options={categorias.filter(
              (cat) => !categoriasSeleccionadas.includes(cat)
            )}
            renderInput={(params) => (
              <TextField {...params} label="Categoría" />
            )}
          />

          {categoriasSeleccionadas.map((categoria) => (
            <Chip
              key={categoria}
              label={categoria}
              onDelete={() => eliminarCategoria(categoria)}
              className="m-1"
            />
          ))}
        </FormControl>
        <button
          className="mt-4 px-4 py-2 bg-pink-200 text-black rounded hover:bg-pink-400 transition-colors duration-200"
          onClick={() => setPasoActual(pasoActual - 1)}
        >
          Retroceder
        </button>
      </div>
      <div className="w-1/2 p-4 flex flex-col">
        <h1 className="mb-4 text-2xl font-bold text-gray-700">Ingredientes</h1>

        <Autocomplete
          value={ingredienteSeleccionado}
          onChange={manejarCambioIngrediente}
          options={ingredientes.filter(
            (ing) => !ingredientesSeleccionados.includes(ing)
          )}
          getOptionLabel={(option) =>
            `${option.nombre} - ${option.cantidad} ${option.nombreMedida}`
          }
          renderInput={(params) => (
            <TextField {...params} label="Buscar ingrediente" />
          )}
        />

        {ingredientesSeleccionados.map((ingrediente) => (
          <Chip
            key={ingrediente.nombre}
            label={`${ingrediente.nombre} - ${ingrediente.cantidad} ${ingrediente.nombreMedida}`}
            onDelete={() => eliminarIngrediente(ingrediente)}
            className="m-1"
          />
        ))}

        <button onClick={() => setFormularioVisible(true)}>
          Agregar ingrediente
        </button>

        <Dialog
          open={formularioVisible}
          onClose={() => setFormularioVisible(false)}
        >
          <DialogTitle>Agregar ingrediente</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              value={nuevoIngrediente.nombre}
              onChange={manejarCambioNuevoIngrediente}
            />
            <Select
              value={nuevoIngrediente.idMedida}
              onChange={manejarCambioNuevoIngrediente}
              name="tipo"
              fullWidth
            >
              <MenuItem value={1}>Kilogramos</MenuItem>
              <MenuItem value={2}>Gramos</MenuItem>
              <MenuItem value={3}>Litro</MenuItem>
              <MenuItem value={4}>Mililitros</MenuItem>
              <MenuItem value={5}>Unidades</MenuItem>
            </Select>
            <TextField
              margin="dense"
              name="cantidad"
              label="Cantidad"
              type="text"
              fullWidth
              value={nuevoIngrediente.cantidad}
              onChange={manejarCambioNuevoIngrediente}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormularioVisible(false)}>
              Cancelar
            </Button>
            <Button onClick={agregarIngrediente}>Agregar</Button>
          </DialogActions>
        </Dialog>

        <button
          className="mt-4 px-4 py-2 bg-pink-200 text-black rounded hover:bg-pink-400 transition-colors duration-200"
          onClick={() => setPasoActual(pasoActual + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Paso2;
