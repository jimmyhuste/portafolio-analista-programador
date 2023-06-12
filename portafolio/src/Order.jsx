import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { DotSpinner } from "@uiball/loaders";
import Swal from "sweetalert2";

function Order() {
  const token = localStorage.getItem("token");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState({
    id: "",
    creationDate: "",
    fileNumber: "",
    medicalCenter: "",
    workType: "",
    stage: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/ordenes", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Results);
          console.log(res);
          setDataTable(
            res.data.Results.map((order) => {
              return {
                id: order.id,
                creationDate: formatDate(order.fecha_creacion),
                fileNumber: order.numero_ficha,
                medicalCenter: order.nombre_centro,
                workType: order.nombre_trabajo,
                stage: order.nombre_etapas,
              };
            })
          );
          setDataLoaded(true);
        } else {
          alert("Error");
        }
      });
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      cellExport: (row) => row.id,
      hide: "lg",
      maxWidth: "10%",
    },
    {
      name: "Fecha de creación",
      selector: (row) => row.creationDate,
      sortable: true,
      cellExport: (row) => row.creationDate,
      hide: "md",
      maxWidth: "15%",
    },
    {
      name: "Nro Ficha",
      selector: (row) => row.fileNumber,
      sortable: true,
      cellExport: (row) => row.fileNumber,
      maxWidth: "10%",
    },
    {
      name: "Tipo",
      selector: (row) => row.workType,
      sortable: true,
      cellExport: (row) => row.workType,
      hide: "sm",
      maxWidth: "10%",
    },
    {
      name: "Etapa",
      selector: (row) => (
        <>
          <button
            onClick={() => {
              window.location.href = `/stages/${row.id}`;
            }}
            className="btn btn-outline-success btn-sm me-2"
          >
            {row.stage}
          </button>
        </>
      ),
      sortable: true,
      cellExport: (row) => row.nombre_etapas,
      maxWidth: "35%",
    },
    {
      name: "Centro",
      selector: (row) => row.medicalCenter,
      sortable: true,
      cellExport: (row) => row.medicalCenter,
      hide: "md",
      maxWidth: "20%",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              window.location.href = `/orderEdit/${row.id}`;
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            Editar
          </button>
          <button
            onClick={() => deleteAlert(row.id)}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
        </>
      ),
      ignoreRowClick: true,
      minWidth: "200px",
    },
  ];

  const swalWillDelete = Swal.mixin({
    customClass: {
      confirmButton: "accept-button",
      cancelButton: "cancel-button",
    },
    buttonsStyling: false,
  });

  const deleteAlert = (id) => {
    swalWillDelete
      .fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar esta orden",
        icon: "warning",
        showCancelButton: true, // Display the cancel button
        confirmButtonText: "Eliminar", // Text for the confirm button
        cancelButtonText: "Cancelar", // Text for the cancel button
      })
      .then((result) => {
        if (result.isConfirmed) {
          // User clicked the confirm button
          handleDelete(id);
        }
      });
  };

  const swalDeleted = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8081/api/ordenes/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
          let timerInterval;
          swalDeleted.fire({
            title: "Orden eliminada",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              window.location.reload(true);
            },
          });
        } else {
          alert(id);
        }
      });
  };

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

  // useEffect(() => {
  //   console.log("dataTable", dataTable);
  // }, [dataTable]);

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
        <h3>Lista de ordenes</h3>
      </div>
      {dataLoaded && (
        <div>
          <DataTableExtensions
            columns={columns}
            data={dataTable}
            filterPlaceholder="Buscar"
            print={false}
            fileName="Lista de órdenes de trabajo"
          >
            <DataTable
              title="Órdenes de trabajo"
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
                to="/createorder"
                className="btn btn-success w-100 h-100 d-flex justify-content-center align-items-center"
                style={styles.panel}
              >
                Crear orden
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
      )}
    </div>
  );
}

export default Order;

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
