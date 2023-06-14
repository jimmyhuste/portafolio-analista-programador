import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { DotSpinner } from "@uiball/loaders";
import Swal from "sweetalert2";

function Stages() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const columns = [
    {
      name: "Fecha de inicio",
      selector: (row) => formatDate(row.fecha_inicio_estado),
      sortable: true,
      cellExport: (row) => row.fecha_inicio_estado,
      hide: "md",
      width: "15%",
    },
    {
      name: "Etapa",
      selector: (row) => row.nombre_etapas,
      sortable: true,
      cellExport: (row) => row.nombre_etapas,
    },
    {
      name: "Estado",
      selector: (row) => row.nombre_estados,
      sortable: true,
      cellExport: (row) => row.nombre_estados,
      hide: "sm",
    },
    {
      name: "Fecha de entrega",
      selector: (row) => formatDate(row.fecha_entrega),
      sortable: true,
      cellExport: (row) => row.fecha_entrega,
      hide: "md",
    },
    {
      name: "Fecha de envío",
      selector: (row) => formatDate(row.fecha_envio),
      sortable: true,
      cellExport: (row) => row.fecha_envio,
      hide: "lg",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              navigate(`/viewStage/${row.id}`);
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            Ver
          </button>
          <button
            onClick={() => {
              // Redirect to the userEdit page
              navigate(`/editStages/${row.id}`);
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            Editar
          </button>
          <button
            onClick={() => {
              deleteAlert(row.id);
            }}
            className="btn btn-outline-danger btn-sm"
          >
            Eliminar
          </button>
        </>
      ),
      ignoreRowClick: true,
      minWidth: "250px",
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
        text: "Una vez eliminado, no podrás recuperar este usuario",
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

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/etapas/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
        setDataLoaded(true);
      });
  }, []);

  const formatDate = (creationDate) => {
    if (creationDate === null) {
      return null;
    }
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
    axios.delete("http://localhost:8081/api/etapa/" + id).then((res) => {
      if (res.data.Status === "Success") {
        if (data.length > 1) {
          let timerInterval;
          swalDeleted.fire({
            title: "Etapa eliminada",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              window.location.reload(true);
            },
          });
        } else {
          let timerInterval;
          swalDeleted.fire({
            title: "Ultima etapa eliminada",
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: "Cerrar",
            willClose: () => {
              clearInterval(timerInterval);
              navigate(`/orders/`);
            },
          });
        }
      } else {
        alert("Error");
      }
    });
  };

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
        <h3>
          Etapas y estados de la órden Nro°
          {data.length > 0 ? data[0].nro_ficha : ""}
        </h3>
      </div>
      {dataLoaded && (
        <div>
          <DataTableExtensions
            columns={columns}
            data={data}
            filterPlaceholder="Buscar"
            print={false}
            fileName={`Listado de etapas de la orden numero ${data[0].nro_ficha}`}
          >
            <DataTable
              title="Etapas y estados de la órden de trabajo"
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
              {dataLoaded && (
                <Link
                  to={`/createStage/${data[0].id_orden}/${data[0].nro_ficha}`}
                  className="btn btn-success w-100 h-100 justify-content-center align-items-center"
                  style={styles.panel}
                >
                  Cambiar etapa
                </Link>
              )}
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 align-items-center">
              <button
                className="btn btn-danger w-100 h-100 justify-content-center align-items-center"
                onClick={() => navigate("/orders")}
                style={styles.panel}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
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
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
