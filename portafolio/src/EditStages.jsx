import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DateComponent from "./components/DateComponent";
import { DotSpinner } from "@uiball/loaders";

function EditStages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedDeliveryDate, setSelecteDeliveryDate] = useState(null);
  const [formattedDeliveryDate, setFormattedDeliveryDate] = useState(null);
  const [selectedDeadlineDate, setSelecteDeadlineDate] = useState(null);
  const [formattedDeadineDate, setFormattedDeadineDate] = useState(null);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [stageErrorMessage, setStageErrorMessage] = useState(false);
  const [stateErrorMessage, setStateErrorMessage] = useState(false);
  const [shippingDateErrorMessage, setShippingDateErrorMessage] =
    useState(false);
  const [deadlineErrorMessage, setDeadlineErrorMessage] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState(false);
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
      setSelecteDeliveryDate(
        res.data.Result[0].fecha_envio
          ? new Date(res.data.Result[0].fecha_envio)
          : new Date()
      );

      setSelecteDeadlineDate(
        res.data.Result[0].fecha_entrega
          ? new Date(res.data.Result[0].fecha_entrega)
          : new Date()
      );
      setDataLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (selectedDeliveryDate) {
      const formattedDelivery = selectedDeliveryDate
        .toISOString()
        .split("T")[0];
      setFormattedDeliveryDate(formattedDelivery);
      setData({ ...data, fecha_envio: formattedDelivery });
    }
  }, [selectedDeliveryDate]);

  useEffect(() => {
    if (selectedDeadlineDate) {
      const formattedDeadline = selectedDeadlineDate
        .toISOString()
        .split("T")[0];
      setFormattedDeadineDate(formattedDeadline);
      setData({ ...data, fecha_entrega: formattedDeadline });
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
    // Error handler
    let hasError = false;
    // Check if any required fields are empty
    // if (
    //   data.id_etapa === "" ||
    //   data.id_estado === "" ||
    //   data.fecha_envio === "" ||
    //   data.fecha_entrega === ""
    // ) {
    //   alert("Por favor, complete todos los campos obligatorios.");
    //   setEmptyFieldsMessage(true);
    //   return;
    // }
    setEmptyFieldsMessage(false);
    // Validate stage
    const validStages = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
    ];

    if (!validStages.includes(data.id_etapa)) {
      setStageErrorMessage(true);
      hasError = true;
    } else {
      setStageErrorMessage(false);
    }
    setEmptyFieldsMessage(false);
    // Validate state
    const validStates = [1, 2, 3, 4, "1", "2", "3", "4"];

    if (!validStates.includes(data.id_estado)) {
      setStateErrorMessage(true);
      hasError = true;
    } else {
      setStateErrorMessage(false);
    }
    // Validate shippingDate
    const currentDateForMaxShipping = new Date();
    const maxShippingDate = currentDateForMaxShipping.setMonth(
      currentDateForMaxShipping.getMonth() + 12
    );
    const currentDateForMinShipping = new Date();
    const minShippingDate = currentDateForMinShipping.setMonth(
      currentDateForMinShipping.getMonth() - 12
    );
    if (
      selectedDeliveryDate < minShippingDate ||
      selectedDeliveryDate > maxShippingDate
    ) {
      setShippingDateErrorMessage(true);
      hasError = true;
    } else {
      setShippingDateErrorMessage(false);
    }
    // Validate deadline
    const currentDateForMaxDeadline = new Date();
    const selectedDeadlineDate = new Date(data.fecha_entrega);
    const maxDeadlineDate = currentDateForMaxDeadline.setMonth(
      currentDateForMaxDeadline.getMonth() + 14
    );
    const currentDateForMinDeadline = new Date();
    const minDeadlineDate = currentDateForMinDeadline.setMonth(
      currentDateForMinDeadline.getMonth() - 12
    );
    if (
      selectedDeadlineDate < minDeadlineDate ||
      selectedDeadlineDate > maxDeadlineDate
    ) {
      setDeadlineErrorMessage(true);
      hasError = true;
    } else {
      setDeadlineErrorMessage(false);
    }
    // Validate description
    if (data.descripcion) {
      if (data.descripcion.length > 255) {
        setDescriptionErrorMessage(true);
        setDescriptionMessage("Indicación muy larga");
        if (data.descripcion === "") {
          setDescriptionMessage("");
        }
      }
      hasError = true;
    } else {
      setDescriptionErrorMessage(false);
    }
    if (hasError) {
      return;
    }
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

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border  w-75">
      <h2>Edición etapa de orden N°{data.id_orden}</h2>
      {dataLoaded && (
        <form className="row g-3 p-4" onSubmit={handleSubmit}>
          <div className="col-12 col-md-6">
            <label htmlFor="inputStage" className="form-label">
              Etapa
            </label>
            <select
              className="form-select"
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
            {stageErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Seleccione una etapa válida</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputStage" className="form-label">
              Estado
            </label>
            <select
              className="form-select"
              onChange={(e) => setData({ ...data, id_estado: e.target.value })}
              value={data.id_estado}
            >
              <option value="1">Cancelado</option>
              <option value="2">Pendiente</option>
              <option value="3">En proceso</option>
              <option value="4">Terminado</option>
            </select>
            {stateErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Seleccione un estado válido</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <DateComponent
              fecha={formattedDeliveryDate}
              title="Fecha de envío"
              onDateChange={handleDeliveryDateChange}
              col="col-12"
              name="idDeliveryDate"
            />
            {shippingDateErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Máximo un año de distancia</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <DateComponent
              fecha={formattedDeadineDate}
              title="Fecha de entrega"
              onDateChange={handleDeadlineDateChange}
              col="col-12"
              name="idDeadline"
            />
            {deadlineErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Debe ser entre 1 año pasado y 14 meses futuros</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12" style={styles.containerInput}>
            <label htmlFor="inputDescription" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control inputDescription h-75 custom-input"
              id="inputDescription"
              placeholder="Modifique descripción"
              autoComplete="off"
              style={styles.customInput}
              onChange={(e) =>
                setData({ ...data, descripcion: e.target.value })
              }
              value={data?.descripcion ? data?.descripcion : ""}
            />
            {descriptionErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>{descriptionMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3">
            <button type="submit" className="btn btn-success w-100">
              Editar etapa
            </button>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div>
              <Link
                to={`/stages/${data.id_orden}`}
                className="btn btn-danger w-100 btn-secondary"
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

const styles = {
  error: {
    color: "red",
    alignItems: "center",
  },
  errorMessage: {
    height: 0,
    overflow: "hidden",
    transition: "height 0.3s",
  },
  errorMessageShow: {
    height: "20px" /* Adjust the height as needed */,
  },
  // style for window error message (alert)
  alert: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    zIndex: "100",
  },
  alertMessage: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInput: {
    height: "120px",
  },
  customInput: {
    backgrondColor: "#fff",
    overflow: "scroll",
    resize: "vertical",
    overflowX: "auto",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
