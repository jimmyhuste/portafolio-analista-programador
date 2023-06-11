import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function CreateStage() {
  const navigate = useNavigate();
  const { id, number } = useParams();
  const [data, setData] = useState({
    id_orden: id,
    nro_ficha: number,
    id_etapa: "",
    id_estado: "",
    fecha_envio: "",
    fecha_entrega: "",
    fecha_inicio_estado: new Date(),
    descripcion: "",
  });
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const handleClose = () => {
    setErrorMessage(false);
  };
  useEffect(() => {
    console.log(id, number);
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if any required fields are empty
    // if (
    //   data.id_etapa === "" ||
    //   data.id_estado === "" ||
    //   data.fecha_envio === "" ||
    //   data.fecha_entrega === "" ||
    //   data.descripcion === ""
    // ) {
    //   alert("Por favor, complete todos los campos obligatorios.");
    //   setEmptyFieldsMessage(true);
    //   return;
    // }
    setEmptyFieldsMessage(false);
    axios
      .post(
        "http://localhost:8081/createStage/" + { id } + "/" + { number },
        data
      )
      .then(() => {
        navigate(`/stages/${id}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border  w-75">
      <h2>Cambio de etapa de orden Nro° {number}</h2>
      <div className="col-12">
        {emptyFieldsMessage && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <div className="d-flex justify-content-between">
              <strong>
                Por favor, complete todos los campos obligatorios.
              </strong>
              <button type="button" className="close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <form className="row g-3 p-4" onSubmit={handleSubmit}>
        <div className="col-6">
          <label htmlFor="inputStage" className="form-label">
            Etapa
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, id_etapa: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Cubeta</option>
            <option value="2">Modelo</option>
            <option value="3">Placa relación</option>
            <option value="4">Base Metálica</option>
            <option value="5">Articulación</option>
            <option value="6">Terminación</option>
            <option value="7">Reparación</option>
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="inputStage" className="form-label">
            Estado
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, id_estado: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Cancelado</option>
            <option value="2">Pendiente</option>
            <option value="3">En proceso</option>
            <option value="4">Terminado</option>
          </select>
        </div>
        <div className="col-6 mt-2">
          <label htmlFor="inputBirthDate" className="form-label">
            Fecha de envio
          </label>
          <input
            type="date"
            className="form-control"
            id="inputShippingDate"
            placeholder="Ingresar fecha de nacimiento"
            autoComplete="off"
            onChange={(e) => setData({ ...data, fecha_envio: e.target.value })}
          />
        </div>
        <div className="col-6 mt-2">
          <label htmlFor="inputBirthDate" className="form-label">
            Fecha de entrega
          </label>
          <input
            type="date"
            className="form-control"
            id="inputDeadline"
            placeholder="Ingresar fecha de nacimiento"
            autoComplete="off"
            onChange={(e) =>
              setData({ ...data, fecha_entrega: e.target.value })
            }
          />
        </div>
        <div className="col-12 mt-4">
          <label htmlFor="inputDescription" className="form-label">
            Descripcion
          </label>
          <input
            type="text"
            className="form-control inputDescription h-100"
            id="inputDescription"
            placeholder="Ingrese descripción"
            autoComplete="off"
            onChange={(e) => setData({ ...data, descripcion: e.target.value })}
          />
        </div>
        <div className="col-4 offset-3 mt-5">
          <button type="submit" className="btn btn-success w-50">
            Cambiar etapa
          </button>
        </div>
        <div className="col-4 mt-5">
          <div>
            <Link
              to={`/stages/${id}`}
              className="btn btn-danger w-50 btn-secondary"
            >
              Volver
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateStage;
