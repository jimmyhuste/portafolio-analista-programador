import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { DotSpinner } from "@uiball/loaders";

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

  const handleDelete = (rut) => {
    axios
      .delete("http://localhost:8081/api/persona/" + rut, {
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

  const columns = [
    {
      name: "Rol",
      selector: (row) => row.nombre_rol,
      sortable: true,
      cellExport: (row) => row.nombre_rol,
      maxWidth: "15%",
      hide: "md",
    },
    {
      name: "Foto perfil",
      cell: (row) => (
        <img
          src={
            row.imagen
              ? `http://localhost:8081/images/${row.imagen}`
              : "http://localhost:8081/images/default_picture.jpg"
          }
          alt=""
          className="userImage"
        />
      ),
      excludeExport: true,
      maxWidth: "10%",
      hide: "sm",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre + " " + row.apellido,
      sortable: true,
      cellExport: (row) => row.nombre + " " + row.apellido,
      maxWidth: "50%",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cellExport: (row) => row.email,
      maxWidth: "35%",
      hide: "md",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              window.location.href = `/userEdit/${row.id}`;
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(row.rut)}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
        </>
      ),
      ignoreExport: true,
      minWidth: "200px",
    },
  ];
  if (data.length === 0) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column mt-3 border px-4 py-2">
      <div className="d-flex justify-content-center">
        <h3>Lista de usuarios</h3>
      </div>
      <DataTableExtensions
        columns={columns}
        data={data}
        filterPlaceholder="Buscar"
        print={false}
        fileName="Lista de usuarios"
      >
        <DataTable
          title="Usuarios"
          defaultSortField="id"
          defaultSortAsc={false}
          pagination
          highlightOnHover
          paginationComponentOptions={{
            rowsPerPageText: "Filas por página:",
            rangeSeparatorText: "de",
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "Todos",
          }}
        />
      </DataTableExtensions>
      <div className="row g-3 p-4">
        <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3 align-items-center">
          <Link
            to="/createuser"
            className="btn btn-success w-100 h-100 d-flex justify-content-center align-items-center"
            style={styles.panel}
          >
            Crear usuario
          </Link>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 align-items-center">
          <Link
            to="/"
            className="btn btn-danger w-100 h-100 d-flex justify-content-center align-items-center"
            style={styles.panel}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default User;

const styles = {
  panel: {
    height: "50%",
    maxHeight: "5rem",
    display: "flex",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
