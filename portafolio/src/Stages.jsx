import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

function Stages() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [parsedCreationDates, setParsedCreationDates] = useState([]);
  const [parsedDeliveryDates, setParsedDeliveryDates] = useState([]);
  const [parsedDeadlineDates, setParsedDeadlineDates] = useState([]);
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
              navigate(`/editStages/${row.id}`);
            }}
            className="btn btn-outline-primary btn-sm me-2"
          >
            Editar
          </button>
          <button
            onClick={() => {
              handleDelete(row.id);
            }}
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

  useEffect(() => {
    console.log("data", data);
  }, [data]);

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
    axios.delete("http://localhost:8081/deleteStage/" + id).then((res) => {
      if (res.data.Status === "Success") {
        if (data.length > 1) {
          window.location.reload(true);
        } else {
          navigate(`/orders/`);
        }
      } else {
        alert("Error");
      }
    });
  };

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
};
