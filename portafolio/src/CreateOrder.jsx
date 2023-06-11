import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import AlertComponent from "./components/AlertComponent";
import ChileanRutify from "chilean-rutify";

function CreateOrder() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [creationDateErrorMessage, setCreationDateErrorMessage] =
    useState(false);
  const [fileNumberErrorMessage, setFileNumberErrorMessage] = useState(false);
  const [patientNameErrorMessage, setPatientNameErrorMessage] = useState(false);
  const [patientNameMessage, setPatientNameMessage] = useState("");
  const [patientLastNameErrorMessage, setPatientLastNameErrorMessage] =
    useState(false);
  const [patientLastNameMessage, setPatientLastNameMessage] = useState(false);
  const [patientRutErrorMessage, setPatientRutErrorMessage] = useState(false);
  const [patientRutMessage, setPatientRutMessage] = useState(false);
  const [patientBirthDateErrorMessage, setPatientBirthDateErrorMessage] =
    useState(false);
  const [medicalCenterErrorMessage, setMedicalCenterErrorMessage] =
    useState(false);
  const [doctorNameErrorMessage, setDoctorNameErrorMessage] = useState(false);
  const [doctorNameMessage, setDoctorNameMessage] = useState("");
  const [doctorLastNameErrorMessage, setDoctorLastNameErrorMessage] =
    useState(false);
  const [doctorLastNameMessage, setDoctorLastNameMessage] = useState("");
  const [doctorRutErrorMessage, setDoctorRutErrorMessage] = useState(false);
  const [doctorRutMessage, setDoctorRutMessage] = useState(false);
  const [workTypeErrorMessage, setWorkTypeErrorMessage] = useState(false);
  const [prothesisErrorMessage, setProthesisErrorMessage] = useState(false);
  const [completitudeErrorMessage, setCompletitudeErrorMessage] =
    useState(false);
  const [stageErrorMessage, setStageErrorMessage] = useState(false);
  const [colorErrorMessage, setColorErrorMessage] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState(false);
  const [indicationsErrorMessage, setIndicationsErrorMessage] = useState(false);
  const [indicationsMessage, setIndicationsMessage] = useState(false);
  const [billingErrorMessage, setBillingErrorMessage] = useState(false);
  const [billingDateErrorMessage, setBillingDateErrorMessage] = useState(false);
  const [licenceErrorMessage, setLicenceErrorMessage] = useState(false);
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [data, setData] = useState({
    creationDate: "",
    fileNumber: "",
    patientName: "",
    patientLastName: "",
    patientRut: "",
    patientBirthDate: "",
    medicalCenter: "",
    doctorName: "",
    doctorLastName: "",
    doctorRut: "",
    workType: "",
    prothesis: "",
    completitude: "",
    stage: "",
    color: "",
    location: "",
    indications: "",
    billing: "",
    billingDate: "",
    licence: "",
  });

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);
  const handleSubmit = (event) => {
    event.preventDefault();
    // Error handler
    let hasError = false;
    // Validate creationDate
    const currentDate = new Date();
    const selectedDate = new Date(data.creationDate);
    const minDate = new Date("2017-01-01");
    if (selectedDate < minDate || selectedDate > currentDate) {
      setCreationDateErrorMessage(true);
      hasError = true;
    } else {
      setCreationDateErrorMessage(false);
    }
    // Validate filenumber
    const fileNumber = /^[0-9]*$/;
    if (!fileNumber.test(data.fileNumber) || data.fileNumber.length > 15) {
      setFileNumberErrorMessage(true);
      hasError = true;
    } else {
      setFileNumberErrorMessage(false);
    }
    // Validate patientName
    const spaceCount = (string) => string.split(" ").length - 1;
    const nameRegex = /^[A-Za-z]*(?:\s[A-Za-z]*){0,2}$/;
    if (!nameRegex.test(data.patientName) || data.patientName.length > 100) {
      setPatientNameErrorMessage(true);
      setPatientNameMessage("Sólo se permiten letras");
      if (spaceCount(data.patientName) > 2) {
        setPatientNameMessage("Máximo 2 espacios");
      }
      hasError = true;
    } else {
      setPatientNameErrorMessage(false);
    }
    // Validate patientName
    if (
      !nameRegex.test(data.patientLastName) ||
      data.patientLastName.length > 100
    ) {
      setPatientLastNameErrorMessage(true);
      setPatientLastNameMessage("Sólo se permiten letras");
      if (spaceCount(data.patientLastName) > 2) {
        setPatientLastNameMessage("Máximo 2 espacios");
      }
      hasError = true;
    } else {
      setPatientLastNameErrorMessage(false);
    }
    // Validate patient rut
    const validateRut = (rut) => {
      const rutRegex = /^\d{1,8}-[\dk]$/;
      return rutRegex.test(rut);
    };
    if (
      !validateRut(data.patientRut) ||
      !ChileanRutify.validRut(data.patientRut)
    ) {
      setPatientRutErrorMessage(true);
      setPatientRutMessage("Rut invalido");
      const hasDot = data.patientRut.includes(".");
      const hasHyphen = data.patientRut.includes("-");
      if (hasDot || !hasHyphen) {
        setPatientRutMessage("Rut debe ser sin puntos y con guión");
      }
      if (data.patientRut === "") {
        setPatientRutMessage("");
      }
      hasError = true;
    } else {
      setPatientRutErrorMessage(false);
    }
    // Validate patient birthdate
    const selectedBirthDate = new Date(data.patientBirthDate);
    const minBirthDate = new Date("1990-01-01");
    if (selectedBirthDate < minBirthDate || selectedBirthDate > currentDate) {
      setPatientBirthDateErrorMessage(true);
      hasError = true;
    } else {
      setPatientBirthDateErrorMessage(false);
    }
    // Validate medical center
    if (
      data.medicalCenter !== 1 &&
      data.medicalCenter !== 2 &&
      data.medicalCenter !== 3 &&
      data.medicalCenter !== "1" &&
      data.medicalCenter !== "2" &&
      data.medicalCenter !== "3"
    ) {
      setMedicalCenterErrorMessage(true);
      hasError = true;
    } else {
      setMedicalCenterErrorMessage(false);
    }
    // Validate doctorName
    if (!nameRegex.test(data.doctorName) || data.doctorName.length > 100) {
      setDoctorNameErrorMessage(true);
      setDoctorNameMessage("Sólo se permiten letras");
      if (spaceCount(data.doctorName) > 1) {
        setDoctorNameMessage("Máximo 1 espacio");
      }
      hasError = true;
    } else {
      setDoctorNameErrorMessage(false);
    }
    // Validate lastNameDoctor
    if (!nameRegex.test(data.doctorLastName) || data.doctorLastName > 100) {
      setDoctorLastNameErrorMessage(true);
      setDoctorLastNameMessage("Sólo se permiten letras");
      if (spaceCount(data.doctorLastName) > 0) {
        setDoctorLastNameMessage("No se permiten espacios");
      }
      hasError = true;
    } else {
      setDoctorLastNameErrorMessage(false);
    }
    // Validate doctor rut
    if (
      !validateRut(data.doctorRut) ||
      !ChileanRutify.validRut(data.doctorRut)
    ) {
      setDoctorRutErrorMessage(true);
      setDoctorRutMessage("Rut invalido");
      const hasDot = data.doctorRut.includes(".");
      const hasHyphen = data.doctorRut.includes("-");
      if (hasDot || !hasHyphen) {
        setDoctorRutMessage("Rut debe ser sin puntos y con guión");
      }
      if (data.doctorRut === "") {
        setDoctorRutMessage("");
      }
      hasError = true;
    } else {
      setPatientRutErrorMessage(false);
    }
    // Validate workType
    if (
      data.workType !== 1 &&
      data.workType !== 2 &&
      data.workType !== 3 &&
      data.workType !== 4 &&
      data.workType !== 5 &&
      data.workType !== "1" &&
      data.workType !== "2" &&
      data.workType !== "3" &&
      data.workType !== "4" &&
      data.workType !== "5"
    ) {
      setWorkTypeErrorMessage(true);
      hasError = true;
    } else {
      setWorkTypeErrorMessage(false);
    }
    // Validate prothesis
    if (
      data.prothesis !== 1 &&
      data.prothesis !== 2 &&
      data.prothesis !== 3 &&
      data.prothesis !== "1" &&
      data.prothesis !== "2" &&
      data.prothesis !== "3"
    ) {
      setProthesisErrorMessage(true);
      hasError = true;
    } else {
      setProthesisErrorMessage(false);
    }
    // Validate completitude
    if (
      data.completitude !== 1 &&
      data.completitude !== 2 &&
      data.completitude !== "1" &&
      data.completitude !== "2"
    ) {
      setCompletitudeErrorMessage(true);
      hasError = true;
    } else {
      setCompletitudeErrorMessage(false);
    }
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

    if (!validStages.includes(data.stage)) {
      setStageErrorMessage(true);
      hasError = true;
    } else {
      setStageErrorMessage(false);
    }
    // Validate colors
    const validColors = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ];

    if (!validColors.includes(data.color)) {
      setColorErrorMessage(true);
      hasError = true;
    } else {
      setColorErrorMessage(false);
    }
    // Validate location
    const validLocations = [1, 2, "1", "2"];

    if (!validLocations.includes(data.location)) {
      setLocationErrorMessage(true);
      hasError = true;
    } else {
      setLocationErrorMessage(false);
    }
    // Validate indications
    if (data.indications.length > 255) {
      setIndicationsErrorMessage(true);
      setIndicationsMessage("Indicación muy larga");
      if (data.indications === "") {
        setIndicationsMessage("");
      }
      hasError = true;
    } else {
      setIndicationsErrorMessage(false);
    }
    // Validate billings
    const validBillings = [1, 2, "1", "2"];

    if (!validBillings.includes(data.billing)) {
      setBillingErrorMessage(true);
      hasError = true;
    } else {
      setBillingErrorMessage(false);
    }
    // Validate billingDate
    const selectedBillingDate = new Date(data.billingDate);
    const minBillingDate = new Date("2017-01-01");
    const maxDate = new Date();
    const maxBillingDate = maxDate.setMonth(maxDate.getMonth() + 6);
    if (
      selectedBillingDate < minBillingDate ||
      selectedBillingDate > maxBillingDate
    ) {
      setBillingDateErrorMessage(true);
      hasError = true;
    } else {
      setBillingDateErrorMessage(false);
    }
    // Validate licence
    const validLicences = [1, "1"];

    if (!validLicences.includes(data.licence)) {
      setLicenceErrorMessage(true);
      hasError = true;
    } else {
      setLicenceErrorMessage(false);
    }
    // Check if any required fields are empty
    if (
      data.creationDate === "" ||
      data.fileNumber === "" ||
      data.patientName === "" ||
      data.patientLastName === "" ||
      data.patientRut === "" ||
      data.patientBirthDate === "" ||
      data.medicalCenter === "" ||
      data.doctorName === "" ||
      data.doctorLastName === "" ||
      data.doctorRut === "" ||
      data.workType === "" ||
      data.prothesis === "" ||
      data.completitude === "" ||
      data.stage === "" ||
      data.color === "" ||
      data.location === "" ||
      data.billing === "" ||
      data.billingDate === "" ||
      data.licence === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    if (hasError) {
      return;
    }
    axios
      .post("http://localhost:8081/api/ordenes/", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then(() => {
        navigate("/orders");
      });
  };
  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border w-75">
      <h2>Crear nueva orden</h2>
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
          <label htmlFor="inputCreationDate" className="form-label">
            Fecha de creación
          </label>
          <input
            type="date"
            className="form-control"
            id="inputCreationDate"
            autoComplete="off"
            onChange={(e) => setData({ ...data, creationDate: e.target.value })}
          />
          {creationDateErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Debe ser del 2017 hasta la fecha actual</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputFileNumber" className="form-label">
            Número de ficha
          </label>
          <input
            type="text"
            className="form-control"
            id="inputFileNumber"
            placeholder="Ingrese número de ficha"
            autoComplete="off"
            onChange={(e) => setData({ ...data, fileNumber: e.target.value })}
          />
          {fileNumberErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Sólo numeros</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputPatientName" className="form-label">
            Nombre del paciente
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPatientName"
            placeholder="Ingrese nombre"
            autoComplete="off"
            onChange={(e) => setData({ ...data, patientName: e.target.value })}
          />
          {patientNameErrorMessage && (
            <div className="col-12">
              <div style={styles.error} className={``}>
                <span>{patientNameMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputPatientLastName" className="form-label">
            Apellido del paciente
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPatientLastName"
            placeholder="Ingrese apellido"
            autoComplete="off"
            onChange={(e) =>
              setData({ ...data, patientLastName: e.target.value })
            }
          />
          {patientLastNameErrorMessage && (
            <div className="col-12">
              <div style={styles.error} className={``}>
                <span>{patientLastNameMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputPatientRut" className="form-label">
            Rut Paciente
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            placeholder="Ingrese rut"
            autoComplete="off"
            onChange={(e) =>
              setData({
                ...data,
                patientRut: e.target.value,
              })
            }
          />
          {patientRutErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>{patientRutMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputBirthDatePatient" className="form-label">
            Fecha nacimiento Paciente
          </label>
          <input
            type="date"
            className="form-control"
            id="inputBirthDatePatient"
            placeholder="Ingresar fecha de nacimiento"
            autoComplete="off"
            onChange={(e) =>
              setData({ ...data, patientBirthDate: e.target.value })
            }
          />
          {patientBirthDateErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Fecha inválida </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputNameDoctor" className="form-label">
            Nombre Doctor
          </label>
          <input
            type="text"
            className="form-control"
            id="inputNameDoctor"
            placeholder="Ingrese Nombre"
            autoComplete="off"
            onChange={(e) => setData({ ...data, doctorName: e.target.value })}
          />
          {doctorNameErrorMessage && (
            <div className="col-12">
              <div style={styles.error} className={``}>
                <span>{doctorNameMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLastNameDoctor" className="form-label">
            Apellido Doctor
          </label>
          <input
            type="text"
            className="form-control"
            id="inputLastNameDoctor"
            placeholder="Ingrese Apellido"
            autoComplete="off"
            onChange={(e) =>
              setData({ ...data, doctorLastName: e.target.value })
            }
          />
          {doctorLastNameErrorMessage && (
            <div className="col-12">
              <div style={styles.error} className={``}>
                <span>{doctorLastNameMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputRutDoctor" className="form-label">
            Rut Doctor
          </label>
          <input
            type="text"
            className="form-control"
            id="inputRutDoctor"
            placeholder="11111111-1"
            autoComplete="off"
            onChange={(e) => setData({ ...data, doctorRut: e.target.value })}
          />
          {doctorRutErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>{doctorRutMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputMedicalCenter" className="form-label">
            Centro Médico
          </label>
          <select
            className="form-select "
            onChange={(e) =>
              setData({ ...data, medicalCenter: e.target.value })
            }
          >
            <option value=""></option>
            <option value="1">Hospital Barros Luco</option>
            <option value="2">Hospital Del Salvador</option>
            <option value="3">Hospital Metropolitano</option>
          </select>
          {medicalCenterErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione un centro médico válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputWorkType" className="form-label">
            Tipo de trabajo
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, workType: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Acrilica</option>
            <option value="2">Metálica</option>
            <option value="3">Reparación</option>
            <option value="4">Antagonista</option>
            <option value="5">Repetición</option>
          </select>
          {workTypeErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione un trabajo válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputProthesis" className="form-label">
            Protesis
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, prothesis: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Superior</option>
            <option value="2">Inferior</option>
            <option value="3">Ambas</option>
          </select>
          {prothesisErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione una protesis válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputCompletitude" className="form-label">
            Completitud
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, completitude: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Total</option>
            <option value="2">Parcial</option>
          </select>
          {completitudeErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione una completitud válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputStage" className="form-label">
            Etapa inicial
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, stage: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Cubeta</option>
            <option value="2">Modelo</option>
            <option value="3">Placa Relación</option>
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
          <label htmlFor="inputColor" className="form-label">
            Color
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, color: e.target.value })}
          >
            <option value=""></option>
            <option value="1">A1</option>
            <option value="2">A2</option>
            <option value="3">A3</option>
            <option value="4">A3.5</option>
            <option value="5">A4</option>
            <option value="6">B1</option>
            <option value="7">B2</option>
            <option value="8">B3</option>
            <option value="9">B4</option>
            <option value="10">C1</option>
            <option value="11">C2</option>
            <option value="12">C3</option>
            <option value="13">C4</option>
            <option value="14">D2</option>
            <option value="15">D3</option>
            <option value="16">D4</option>
          </select>
          {colorErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione un color válido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLocation" className="form-label">
            Ubicacion
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, location: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Laboratorio</option>
            <option value="2">Hospital</option>
          </select>
          {locationErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione una ubicación válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputIndications" className="form-label">
            Indicaciones
          </label>
          <input
            type="text"
            className="form-control"
            id="inputIndications"
            placeholder="Ingresar indicaciones"
            autoComplete="off"
            onChange={(e) => setData({ ...data, indications: e.target.value })}
          />
          {indicationsErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>{indicationsMessage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputBill" className="form-label">
            Factura
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, billing: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Exenta</option>
            <option value="2">Electronica Exenta</option>
          </select>
          {billingErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione una factura válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputBillingDate" className="form-label">
            Fecha de facturación
          </label>
          <input
            type="date"
            className="form-control"
            id="inputBillingDate"
            autoComplete="off"
            onChange={(e) => setData({ ...data, billingDate: e.target.value })}
          />
          {billingDateErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Debe ser del 2017 hasta hoy</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLicence" className="form-label">
            Licencia
          </label>
          <select
            className="form-select"
            onChange={(e) => setData({ ...data, licence: e.target.value })}
          >
            <option value=""></option>
            <option value="1">2069-67-LP18</option>
          </select>
          {licenceErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Seleccione una factura válida</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3">
          <button type="submit" className="btn btn-success w-100">
            Crear orden
          </button>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <button
            className="btn btn-danger w-100 btn-secondary"
            onClick={() => navigate("/orders")}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrder;

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
};
