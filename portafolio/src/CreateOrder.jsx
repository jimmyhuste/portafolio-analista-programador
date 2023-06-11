import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function CreateOrder() {
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

  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [passErrorMessage, setPassErrorMessage] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setPassErrorMessage(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if any required fields are empty
    // if (
    //   data.name === "" ||
    //   data.lastName === "" ||
    //   data.rut === "" ||
    //   data.email === "" ||
    //   data.birthDate === "" ||
    //   data.address === "" ||
    //   data.password === "" ||
    //   data.confirmPassword === "" ||
    //   data.role === "" ||
    //   data.phone === ""
    // ) {
    //   alert("Por favor, complete todos los campos obligatorios.");
    //   setEmptyFieldsMessage(true);
    //   return;
    // }
    setEmptyFieldsMessage(false);
    setPassErrorMessage(false);
    const formdata = new FormData();
    formdata.append("creationDate", data.creationDate);
    formdata.append("fileNumber", data.fileNumber);
    formdata.append("patientName", data.patientName);
    formdata.append("patientLastName", data.patientLastName);
    formdata.append("patientRut", data.patientRut);
    formdata.append("patientBirthDate", data.patientBirthDate);
    formdata.append("medicalCenter", data.medicalCenter);
    formdata.append("doctorName", data.doctorName);
    formdata.append("doctorLastName", data.doctorLastName);
    formdata.append("doctorRut", data.doctorRut);
    formdata.append("workType", data.workType);
    formdata.append("prothesis", data.prothesis);
    formdata.append("completitude", data.completitude);
    formdata.append("stage", data.stage);
    formdata.append("color", data.color);
    formdata.append("location", data.location);
    formdata.append("indications", data.indications);
    formdata.append("billing", data.billing);
    formdata.append("licence", data.licence);
    axios.post("http://localhost:8081/createOrder", data).then(() => {
      console.log("asdasd");
      navigate("/orders");
    });
  };
  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border w-75">
      <h2>Crear nueva orden</h2>
      <div className="col-12">
        {emptyFieldsMessage && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <div className="d-flex justify-content-between">
              <strong>
                Por favor, complete todos los campos obligatorios.
              </strong>
              <button type="button" className="close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <form className="row g-3 p-4" onSubmit={handleSubmit}>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
          <label htmlFor="inputMedicalCenter" className="form-label">
            Centro Médico
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) =>
              setData({ ...data, medicalCenter: e.target.value })
            }
          >
            <option value=""></option>
            <option value="1">Hospital Barros Luco</option>
            <option value="2">Hospital Del Salvador</option>
            <option value="3">Hospital Metropolitano</option>
          </select>
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
          <label htmlFor="inputWorkType" className="form-label">
            Tipo de trabajo
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, workType: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Acrilica</option>
            <option value="2">Metálica</option>
            <option value="3">Reparación</option>
            <option value="4">Antagonista</option>
            <option value="5">Repetición</option>
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="inputProthesis" className="form-label">
            Protesis
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, prothesis: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Superior</option>
            <option value="2">Inferior</option>
            <option value="3">Ambas</option>
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="inputCompletitude" className="form-label">
            Completitud
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, completitude: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Total</option>
            <option value="2">Parcial</option>
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="inputStage" className="form-label">
            Etapa inicial
          </label>
          <select
            className="form-select mb-3"
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
        </div>
        <div className="col-6">
          <label htmlFor="inputColor" className="form-label">
            Color
          </label>
          <select
            className="form-select mb-3"
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
        </div>
        <div className="col-6">
          <label htmlFor="inputLocation" className="form-label">
            Ubicacion
          </label>
          <input
            type="text"
            className="form-control"
            id="inputLocation"
            placeholder="Ingresar ubicacion actual"
            autoComplete="off"
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
          <label htmlFor="inputBill" className="form-label">
            Factura
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, billing: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Exenta</option>
            <option value="2">Electronica Exenta</option>
          </select>
        </div>
        <div className="col-6">
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
        </div>
        <div className="col-6">
          <label htmlFor="inputLicence" className="form-label">
            Licencia
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, licence: e.target.value })}
          >
            <option value=""></option>
            <option value="1">2069-67-LP18</option>
          </select>
        </div>
        <div className="col-4 offset-3">
          <button type="submit" className="btn btn-success w-50">
            Crear orden
          </button>
        </div>
        <div className="col-4">
          <button
            className="btn btn-danger w-50 btn-secondary"
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
