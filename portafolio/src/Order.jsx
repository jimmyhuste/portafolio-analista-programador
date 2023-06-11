import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Order() {
  const [data, setData] = useState([]);
  const [parsedCreationDates, setParsedCreationDates] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/getOrders").then((res) => {
      if (res.data.Status === "Success") {
        const formattedDates = res.data.Result.map((order) =>
          formatDate(order.fecha_creacion)
        );
        setData(res.data.Result);
        setParsedCreationDates(formattedDates);
      } else {
        alert("Error");
      }
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
    axios.delete("http://localhost:8081/deleteOrder/" + id).then((res) => {
      if (res.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error");
      }
    });
  };

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-center">
        <h3>Lista de ordenes</h3>
      </div>
      <Link to="/createorder" className="btn btn-success">
        Crear orden
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th className="col-sm-2">Fecha Creacion</th>
            <th className="col-sm-2">Nro Ficha</th>
            <th className="col-sm-2">Tipo</th>
            <th className="col-sm-2">Etapa</th>
            <th className="col-sm-2">Centro</th>
            <th className="col-sm-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => {
            return (
              <tr key={index}>
                <td>{parsedCreationDates[index]}</td>
                <td>{order.numero_ficha}</td>
                <td>{order.nombre_trabajo}</td>
                <td>
                  <Link
                    to={`/stages/` + order.id}
                    className="btn btn-outline-success btn-sm me-2"
                  >
                    {order.nombre_etapas}
                  </Link>
                </td>

                <td>{order.nombre_centro}</td>
                <td>
                  <Link
                    to={`/orderEdit/` + order.id}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(order.id)}
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
  );
}

export default Order;
