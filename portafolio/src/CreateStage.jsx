import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AlertComponent from "./components/AlertComponent";

function CreateStage() {
  const navigate = useNavigate();
  const { id, number } = useParams();
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    id_orden: id,
    nro_ficha: number,
    id_etapa: "",
    id_estado: "",
    fecha_envio: "",
    fecha_entrega: "",
    descripcion: "",
  });
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [stageErrorMessage, setStageErrorMessage] = useState(false);
  const [stateErrorMessage, setStateErrorMessage] = useState(false);
  const [shippingDateErrorMessage, setShippingDateErrorMessage] =
    useState(false);
  const [deadlineErrorMessage, setDeadlineErrorMessage] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deadlineMessage, setDeadlineMessage] = useState("false");

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  useEffect(() => {
    console.log(id, number);
  }, []);

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
    const selectedShippingDate = new Date(data.fecha_envio);
    const maxShippingDate = currentDateForMaxShipping.setMonth(
      currentDateForMaxShipping.getMonth() + 12
    );
    const currentDateForMinShipping = new Date();
    const minShippingDate = currentDateForMinShipping.setMonth(
      currentDateForMinShipping.getMonth() - 12
    );
    if (
      selectedShippingDate < minShippingDate ||
      selectedShippingDate > maxShippingDate
    ) {
      setShippingDateErrorMessage(true);
      setDeliveryMessage("Debe ser entre hoy y un año más.");
      hasError = true;
      console.log(minShippingDate, maxShippingDate, selectedShippingDate);
    } else {
      setShippingDateErrorMessage(false);
    }
    if (data.fecha_envio === "") {
      setShippingDateErrorMessage(true);
      setDeliveryMessage("Campo obligatorio");
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
      setDeadlineMessage("Debe ser entre hoy y 12 meses más.");
      hasError = true;
    } else {
      setDeadlineErrorMessage(false);
    }
    if (data.fecha_entrega === "") {
      setDeadlineErrorMessage(true);
      setDeadlineMessage("Campo obligatorio");
      hasError = true;
    } else {
      setDeadlineErrorMessage(false);
    }
    // Validate description
    if (data.descripcion.length > 255) {
      setDescriptionErrorMessage(true);
      setDescriptionMessage("Indicación muy larga");
      if (data.descripcion === "") {
        setDescriptionMessage("");
      }
      hasError = true;
    } else {
      setDescriptionErrorMessage(false);
    }
    // Check if any required fields are empty
    if (
      data.id_etapa === "" ||
      data.id_estado === "" ||
      data.fecha_envio === "" ||
      data.fecha_entrega === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }
    axios
      .post(`http://localhost:8081/api/etapas/${id}/${number}`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then(() => {
        navigate(`/stages/${id}`);
      })
      .catch((err) => {
        console.log(data), console.log(err);
      });
  };

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border w-75">
      <h2>Cambio de etapa de orden Nro° {number}</h2>
      <div className="col-12">
        {emptyFieldsMessage && (
          <AlertComponent
            emptyFieldsMessage={emptyFieldsMessage}
            handleCloseEmpty={handleCloseEmpty}
          />
        )}
      </div>
      <form className="row g-3 p-4" onSubmit={handleSubmit}>
        <div className="col-12 col-md-6">
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
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, id_estado: e.target.value })}
          >
            <option value=""></option>
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
        <div className="col-12 col-md-6 mt-2">
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
          {shippingDateErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>{deliveryMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6 mt-2">
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
          {deadlineErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>{deadlineMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12" style={styles.containerInput}>
          <label htmlFor="inputDescription" className="form-label">
            Descripcion
          </label>
          <textarea
            className="form-control inputDescription h-75"
            id="inputDescription"
            placeholder="Ingrese descripción"
            autoComplete="off"
            style={styles.customInput}
            onChange={(e) => setData({ ...data, descripcion: e.target.value })}
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
            Cambiar etapa
          </button>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div>
            <Link
              to={`/stages/${id}`}
              className="btn btn-danger w-100 btn-secondary"
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
};
