import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DateComponent from "./components/DateComponent";

function EditStages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedDeliveryDate, setSelecteDeliveryDate] = useState(null);
  const [formattedDeliveryDate, setFormattedDeliveryDate] = useState(null);
  const [selectedDeadlineDate, setSelecteDeadlineDate] = useState(null);
  const [formattedDeadineDate, setFormattedDeadineDate] = useState(null);
  //ANCHOR - data
  const [data, setData] = useState({
    descripcion: "",
    fecha_entrega: "",
    fecha_envio: "",
    fecha_inicio_estado: "",
    id: "",
    id_estado: "",
    id_etapa: "",
    id_orden: "",
    nro_ficha: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8081/getStage/" + id).then((res) => {
      const creationDate = new Date(res.data.Result[0].fecha_inicio_estado);
      creationDate.setDate(creationDate.getDate() + 1);
      const creationDateFormatted =
        creationDate.getFullYear() +
        "-" +
        ("0" + (creationDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + creationDate.getDate()).slice(-2);
      console.log(res.data.Result[0]);
      setData({
        ...data,
        descripcion: res.data.Result[0].descripcion,
        fecha_entrega: res.data.Result[0].fecha_entrega,
        fecha_envio: res.data.Result[0].fecha_envio,
        fecha_inicio_estado: creationDateFormatted,
        id: res.data.Result[0].id,
        id_estado: res.data.Result[0].id_estado,
        id_etapa: res.data.Result[0].id_etapa,
        id_orden: res.data.Result[0].id_orden,
        nro_ficha: res.data.Result[0].nro_ficha,
      });
      setSelecteDeliveryDate(new Date(res.data.Result[0].fecha_entrega));
      setSelecteDeadlineDate(new Date(res.data.Result[0].fecha_envio));
      setDataLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (selectedDeliveryDate) {
      const formatted = selectedDeliveryDate.toISOString().split("T")[0];
      setFormattedDeliveryDate(formatted);
      setData({ ...data, fecha_entrega: formatted });
    }
  }, [selectedDeliveryDate]);

  useEffect(() => {
    if (selectedDeadlineDate) {
      const formatted = selectedDeadlineDate.toISOString().split("T")[0];
      setFormattedDeadineDate(formatted);
      setData({ ...data, fecha_envio: formatted });
    }
  }, [selectedDeadlineDate]);

  const handleDeliveryDateChange = (newDate) => {
    setSelecteDeliveryDate(newDate);
  };

  const handleDeadlineDateChange = (newDate) => {
    setSelecteDeadlineDate(newDate);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      ...data,
      fecha_entrega: data.fecha_entrega || "1970-01-01",
      fecha_envio: data.fecha_envio || "1970-01-01",
    };

    if (requestData.fecha_entrega) {
      requestData.fecha_entrega = new Date(requestData.fecha_entrega)
        .toISOString()
        .split("T")[0];
    }
    if (requestData.fecha_envio) {
      requestData.fecha_envio = new Date(requestData.fecha_envio)
        .toISOString()
        .split("T")[0];
    }
    axios
      .put("http://localhost:8081/updateStage/" + id, requestData)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/stages/" + data.id_orden);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border  w-75">
      <h2>Edición de etapa</h2>
      {dataLoaded && (
        <form className="row g-3 p-4" onSubmit={handleSubmit}>
          <DateComponent
            fecha={formattedDeliveryDate}
            title="Fecha de entrega"
            onDateChange={handleDeliveryDateChange}
            col="col-6"
            name="idDeliveryDate"
          />
          <DateComponent
            fecha={formattedDeadineDate}
            title="Fecha de envío"
            onDateChange={handleDeadlineDateChange}
            col="col-6"
            name="idDeadline"
          />
          <div className="col-6 mt-4">
            <label htmlFor="inputStage" className="form-label">
              Etapa
            </label>
            <select
              className="form-select mb-3"
              onChange={(e) => setData({ ...data, id_etapa: e.target.value })}
              value={data.id_etapa}
            >
              <option value="1">Cubeta</option>
              <option value="2">Modelo</option>
              <option value="3">Placa relación</option>
              <option value="4">Base Metálica</option>
              <option value="5">Articulación</option>
              <option value="6">Terminación</option>
              <option value="7">Reparación</option>
            </select>
          </div>
          <div className="col-6 mt-4">
            <label htmlFor="inputStage" className="form-label">
              Estado
            </label>
            <select
              className="form-select mb-3"
              onChange={(e) => setData({ ...data, id_estado: e.target.value })}
              value={data.id_estado}
            >
              <option value="1">Cancelado</option>
              <option value="2">Pendiente</option>
              <option value="3">En proceso</option>
              <option value="4">Terminado</option>
            </select>
          </div>
          <div className="col-12 row-2">
            <label htmlFor="inputDescription" className="form-label">
              Descripción
            </label>
            <input
              type="text"
              className="form-control inputDescription h-100"
              id="inputDescription"
              placeholder="Modifique descripción"
              autoComplete="off"
              onChange={(e) =>
                setData({ ...data, descripcion: e.target.value })
              }
              value={data?.descripcion ? data?.descripcion : ""}
            />
          </div>
          <div className="col-4 offset-3 mt-5">
            <button type="submit" className="btn btn-success w-50">
              Editar etapa
            </button>
          </div>
          <div className="col-4 mt-5">
            <div>
              <Link
                to={`/stages/${data.id_orden}`}
                className="btn btn-danger w-50 btn-secondary"
              >
                Volver
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default EditStages;
