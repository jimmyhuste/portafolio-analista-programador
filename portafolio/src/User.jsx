import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function User() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/persona", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data);
          setData(res.data.data);
        } else {
          alert("Error");
        }
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8081/api/persona/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
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
        <h3>Lista de usuarios</h3>
      </div>
      <Link to="/createuser" className="btn btn-success">
        Crear usuario
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th className="col-sm-2">Rol</th>
            <th className="col-sm-2">Nombre</th>
            <th className="col-sm-2">Imagen</th>
            <th className="col-sm-2">Email</th>
            <th className="col-sm-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => {
            return (
              <tr key={index}>
                <td>{user.nombre_rol}</td>
                <td>
                  {user.nombre} {user.apellido}
                </td>
                <td>
                  {
                    <img
                      src={
                        user.imagen
                          ? `http://localhost:8081/images/${user.imagen}`
                          : "http://localhost:8081/images/default_picture.jpg"
                      }
                      alt=""
                      className="userImage"
                    />
                  }
                </td>
                <td>{user.email}</td>
                <td>
                  <Link
                    to={`/userEdit/` + user.id}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user.rut)}
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

export default User;
