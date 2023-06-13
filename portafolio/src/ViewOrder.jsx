import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DotSpinner } from "@uiball/loaders";

function ViewOrder() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
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
    color: "",
    location: "",
    indications: "",
    billing: "",
    billingDate: "",
    licence: "",
    stage: "",
  });
  const [name, setName] = useState({ name: "" });
  const [parsedCreationDate, setParsedCreationDate] = useState("");
  const [parsedPatientBirthdate, setParsedPatientBirthdate] = useState("");
  const [parsedBillingDate, setParsedBillingDate] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/ordenes/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        // const creationDate = new Date(res.data.fecha_creacion);
        // creationDate.setDate(creationDate.getDate() - 1);
        // const billinghDate = new Date(res.data.fecha_facturacion);
        // billinghDate.setDate(billinghDate.getDate() - 1);
        // const patientBirthDate = new Date(res.data.patient_birth_date);
        // patientBirthDate.setDate(patientBirthDate.getDate() - 1);
        setData({
          ...data,
          creationDate: res.data.fecha_creacion,
          fileNumber: res.data.numero_ficha,
          patientName: res.data.patient_name,
          patientLastName: res.data.patient_last_name,
          patientRut: res.data.rut_paciente,
          patientBirthDate: res.data.patient_birth_date,
          medicalCenter: res.data.centro,
          doctorName: res.data.doctor_name,
          doctorLastName: res.data.doctor_last_name,
          doctorRut: res.data.rut_doctor,
          workType: res.data.tipo_trabajo,
          prothesis: res.data.protesis,
          completitude: res.data.completitud,
          color: res.data.color,
          location: res.data.ubicacion,
          indications: res.data.indicaciones,
          billing: res.data.tipo_factura,
          billingDate: res.data.fecha_facturacion,
          licence: res.data.licencia,
          stage: res.data.etapa,
        });
        setDataLoaded(true);
        setName({
          name: res.data.numero_ficha,
        });
      });
  }, []);

  useEffect(() => {
    const creationDate = new Date(data.creationDate);
    const billingDate = new Date(data.billingDate);
    const patientDate = new Date(data.patientBirthDate);
    creationDate.setDate(creationDate.getDate() + 1);
    billingDate.setDate(billingDate.getDate() + 1);
    patientDate.setDate(patientDate.getDate() + 1);
    const creationDateFormatted =
      creationDate.getFullYear() +
      "-" +
      ("0" + (creationDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + creationDate.getDate()).slice(-2);
    const billingDateFormatted =
      billingDate.getFullYear() +
      "-" +
      ("0" + (billingDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + billingDate.getDate()).slice(-2);
    const patientDateFormatted =
      patientDate.getFullYear() +
      "-" +
      ("0" + (patientDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + patientDate.getDate()).slice(-2);
    setParsedCreationDate(creationDateFormatted);
    setParsedPatientBirthdate(patientDateFormatted);
    setParsedBillingDate(billingDateFormatted);
  }, [data.creationDate, data.billingDate, data.patientBirthDate]);

  if (!dataLoaded) {
    return (
      <div style={styles.spinner}>
        <DotSpinner size={35} color="#231F20" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column mx-auto pt-2 mt-3 border w-100">
      <div className="d-flex flex-row justify-content-center p-4">
        <h2>Orden Nro°{name.name}</h2>
      </div>
      <div className="d-flex flex-row row">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="d-flex flex-row row col-12 col-md-12 p-4">
                <div className="d-flex flex-row justify-content-start userTitle">
                  Información de la orden:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de creación:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Centro médico:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Tipo de trabajo:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Protesis:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Completitud:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Color:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Ubicacion:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Factura:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de facturación:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Licencia:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Indicaciones:
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex flex-row row col-12 col-md-12 p-4">
                <div className="d-flex flex-row justify-content-start userTitle">
                  Información del paciente:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Nombre:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Apellido:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Rut:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de nacimiento:
                </div>
              </div>
              <div className="d-flex flex-row row col-12 col-md-12 p-4">
                <div className="d-flex flex-row justify-content-start userTitle">
                  Información del doctor:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Nombre:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Apellido:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Rut:
                </div>
                <div className="d-flex m-2 col-12 justify-content-start userDetails">
                  Fecha de nacimiento:
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 p-4">
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
            value={parsedCreationDate}
          />
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
            value={data.fileNumber}
          />
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
            value={data.patientName}
          />
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
            value={data.patientLastName}
          />
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
            value={data.patientRut}
            disabled
          />
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
            value={parsedPatientBirthdate}
          />
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
            value={data.doctorName}
          />
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
            value={data.doctorLastName}
          />
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
            value={data.doctorRut}
            disabled
          />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputMedicalCenter" className="form-label">
            Centro Médico
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) =>
              setData({ ...data, medicalCenter: e.target.value })
            }
            value={data.medicalCenter}
          >
            <option value="1">Hospital Barros Luco</option>
            <option value="2">Hospital Del Salvador</option>
            <option value="3">Hospital Metropolitano</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputWorkType" className="form-label">
            Tipo de trabajo
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, workType: e.target.value })}
            value={data.workType}
          >
            <option value="1">Acrilica</option>
            <option value="2">Metálica</option>
            <option value="3">Reparación</option>
            <option value="4">Antagonista</option>
            <option value="5">Repetición</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputProthesis" className="form-label">
            Protesis
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, prothesis: e.target.value })}
            value={data.prothesis}
          >
            <option value="1">Superior</option>
            <option value="2">Inferior</option>
            <option value="3">Ambas</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputCompletitude" className="form-label">
            Completitud
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, completitude: e.target.value })}
            value={data.completitude}
          >
            <option value="1">Total</option>
            <option value="2">Parcial</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputColor" className="form-label">
            Color
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, color: e.target.value })}
            value={data.color}
          >
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
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLocation" className="form-label">
            Ubicacion
          </label>
          <select
            className="form-select "
            onChange={(e) => setData({ ...data, location: e.target.value })}
            value={data.location}
          >
            <option value=""></option>
            <option value="1">Laboratorio</option>
            <option value="2">Hospital</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputIndications" className="form-label">
            Indicaciones
          </label>
          <input
            type="text"
            className="form-control"
            id="inputIndications"
            placeholder="Ingresar indications"
            autoComplete="off"
            onChange={(e) => setData({ ...data, indications: e.target.value })}
            value={data.indications}
          />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputBill" className="form-label">
            Factura
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, billing: e.target.value })}
            value={data.billing}
          >
            <option value="1">Exenta</option>
            <option value="2">Electronica Exenta</option>
          </select>
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
            value={parsedBillingDate}
          />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="inputLicence" className="form-label">
            Licencia
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, licence: e.target.value })}
            value={data.licence}
          >
            <option value="1">2069-67-LP18</option>
          </select>
        </div>
        <div className="col-12 row">
          <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3 mb-3">
            <button type="submit" className="btn btn-success w-100">
              Editar
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
        </div>
      </div>
    </div>
  );
}

export default ViewOrder;

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
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};
