import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function Stages() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [parsedCreationDates, setParsedCreationDates] = useState([]);
  const [parsedDeliveryDates, setParsedDeliveryDates] = useState([]);
  const [parsedDeadlineDates, setParsedDeadlineDates] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    axios.get("http://localhost:8081/getStages/" + id).then((res) => {
      const formattedDates = res.data.Result.map((stage) =>
        formatDate(stage.fecha_inicio_estado)
      );
      const formattedDeliveryDates = res.data.Result.map((stage) =>
        formatDate(stage.fecha_entrega)
      );
      const formattedDeadlineDates = res.data.Result.map((stage) =>
        formatDate(stage.fecha_envio)
      );
      setData(res.data.Result);
      console.log(res.data.Result);
      setParsedCreationDates(formattedDates);
      setParsedDeliveryDates(formattedDeliveryDates);
      setParsedDeadlineDates(formattedDeadlineDates);
      setDataLoaded(true);
    });
  }, []);

  const formatDate = (creationDate) => {
    const date = new Date(creationDate);
    const creationDateFormatted =
      ("0" + date.getDate()).slice(-2) +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      date.getFullYear();
    return creationDateFormatted;
  };

  const handleDelete = (id) => {
    axios.delete("http://localhost:8081/deleteStage/" + id).then((res) => {
      if (res.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error");
      }
    });
  };

  return (
    <div>
      {" "}
      <div className="px-5 py-3">
        <div className="d-flex justify-content-center">
          <h3>
            Etapas y estados de la órden Nro°
            {data.length > 0 ? data[0].nro_ficha : ""}
          </h3>
        </div>
        <div
          className="d-flex justify-content-between"
          style={{ height: "100px" }}
        >
          <div className="d-flex col-6 col-md-4 col-sm-5 col-lg-3 col-xl-2 align-items-center">
            {dataLoaded && (
              <Link
                to={`/createStage/${data[0].id_orden}/${data[0].nro_ficha}`}
                className="btn btn-success w-50 justify-content-center align-items-center"
                style={styles.panel}
              >
                Añadir etapa
              </Link>
            )}
          </div>
          <div className="d-flex col-6 col-md-4 col-sm-5 col-lg-3 col-xl-2 justify-content-end align-items-center">
            <button
              className="btn btn-danger w-50 justify-content-center align-items-center"
              onClick={() => navigate("/orders")}
              style={styles.panel}
            >
              Volver
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="col-sm-2">Fecha de inicio</th>
              <th className="col-sm-2">Etapa</th>
              <th className="col-sm-2">Estado</th>
              <th className="col-sm-2">Fecha de entrega</th>
              <th className="col-sm-2">fecha de envio</th>
              <th className="col-sm-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stage, index) => {
              return (
                <tr key={index}>
                  <td>{parsedCreationDates[index]}</td>
                  <td>{stage.nombre_etapas}</td>
                  <td>{stage.nombre_estados}</td>
                  <td>{parsedDeliveryDates[index]}</td>
                  <td>{parsedDeadlineDates[index]}</td>
                  <td>
                    <Link
                      to={`/editStages/` + stage.id}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(stage.id)}
                      className="btn btn-danger btn-sm me-2"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stages;

const styles = {
  panel: {
    height: "50%",
    maxHeight: "5rem",
    display: "flex",
  },
};
