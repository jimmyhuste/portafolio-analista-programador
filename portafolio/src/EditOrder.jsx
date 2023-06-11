import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    fecha_creacion: "",
    numero_ficha: "",
    patient_name: "",
    patient_last_name: "",
    rut_paciente: "",
    patient_birth_date: "",
    centro: "",
    doctor_name: "",
    doctor_last_name: "",
    rut_doctor: "",
    tipo_trabajo: "",
    protesis: "",
    completitud: "",
    color: "",
    ubicacion: "",
    indicaciones: "",
    tipo_factura: "",
    fecha_facturacion: "",
    licencia: "",
  });
  const [name, setName] = useState({ name: "" });
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [passErrorMessage, setPassErrorMessage] = useState(false);
  const [parsedCreationDate, setParsedCreationDate] = useState("");
  const [parsedPatientBirthdate, setParsedPatientBirthdate] = useState("");
  const [parsedBillingDate, setParsedBillingDate] = useState("");

  const handleClose = () => {
    setPassErrorMessage(false);
  };

  useEffect(() => {
    axios.get("http://localhost:8081/getOrder/" + id).then((res) => {
      const creationDate = new Date(res.data.Result[0].fecha_creacion);
      creationDate.setDate(creationDate.getDate() - 1);
      const billinghDate = new Date(res.data.Result[0].fecha_facturacion);
      billinghDate.setDate(billinghDate.getDate() - 1);
      const patientBirthDate = new Date(res.data.Result[0].patient_birth_date);
      patientBirthDate.setDate(patientBirthDate.getDate() - 1);
      setData({
        ...data,
        fecha_creacion: creationDate,
        numero_ficha: res.data.Result[0].numero_ficha,
        patient_name: res.data.Result[0].patient_name,
        patient_last_name: res.data.Result[0].patient_last_name,
        rut_paciente: res.data.Result[0].rut_paciente,
        patient_birth_date: patientBirthDate,
        centro: res.data.Result[0].centro,
        doctor_name: res.data.Result[0].doctor_name,
        doctor_last_name: res.data.Result[0].doctor_last_name,
        rut_doctor: res.data.Result[0].rut_doctor,
        tipo_trabajo: res.data.Result[0].tipo_trabajo,
        protesis: res.data.Result[0].protesis,
        completitud: res.data.Result[0].completitud,
        color: res.data.Result[0].color,
        ubicacion: res.data.Result[0].ubicacion,
        indicaciones: res.data.Result[0].indicaciones,
        tipo_factura: res.data.Result[0].tipo_factura,
        fecha_facturacion: billinghDate,
        licencia: res.data.Result[0].licencia,
      });
      setName({
        name: res.data.Result[0].numero_ficha,
      });
    });
  }, []);

  useEffect(() => {
    const creationDate = new Date(data.fecha_creacion);
    const billingDate = new Date(data.fecha_facturacion);
    const patientDate = new Date(data.patient_birth_date);
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
  }, [data.fecha_creacion, data.fecha_facturacion, data.patient_birth_date]);

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
    if (
      typeof data.patient_birth_date === "object" ||
      typeof data.fecha_creacion === "object" ||
      typeof data.fecha_facturacion === "object"
    ) {
      const patientBirthDate = new Date(data.patient_birth_date);
      const creationDate = new Date(data.fecha_creacion);
      const billingDate = new Date(data.fecha_facturacion);
      patientBirthDate.setDate(patientBirthDate.getDate() + 1);
      creationDate.setDate(creationDate.getDate() + 1);
      billingDate.setDate(billingDate.getDate() + 1);
      const newPatientDate = new Date(patientBirthDate);
      const newCreationDate = new Date(creationDate);
      const newBillingdate = new Date(billingDate);
      const patientYear = newPatientDate.getFullYear();
      const creationYear = newCreationDate.getFullYear();
      const billingYear = newBillingdate.getFullYear();
      const patientMonth = String(newPatientDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const creationMonth = String(newCreationDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const billingMonth = String(newBillingdate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const patientDay = String(newPatientDate.getDate()).padStart(2, "0");
      const creationDay = String(newCreationDate.getDate()).padStart(2, "0");
      const billingDay = String(newBillingdate.getDate()).padStart(2, "0");

      const formattedPatientBirthDate = `${patientYear}-${patientMonth}-${patientDay}`;
      const formattedCreationDay = `${creationYear}-${creationMonth}-${creationDay}`;
      const formattedBillingDay = `${billingYear}-${billingMonth}-${billingDay}`;

      // Update the data object with the formatted birthDate
      const updatedData = {
        ...data,
        patient_birth_date: formattedPatientBirthDate,
        fecha_creacion: formattedCreationDay,
        fecha_facturacion: formattedBillingDay,
      };
      axios
        .put("http://localhost:8081/updateOrder/" + id, updatedData)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/orders");
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .put("http://localhost:8081/updateOrder/" + id, data)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/orders");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border  w-75">
      <h2>Edición de orden Nro°{name.name}</h2>
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
            onChange={(e) =>
              setData({ ...data, fecha_creacion: e.target.value })
            }
            value={parsedCreationDate}
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
            onChange={(e) => setData({ ...data, numero_ficha: e.target.value })}
            value={data.numero_ficha}
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
            onChange={(e) => setData({ ...data, patient_name: e.target.value })}
            value={data.patient_name}
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
              setData({ ...data, patient_last_name: e.target.value })
            }
            value={data.patient_last_name}
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
            value={data.rut_paciente}
            disabled
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
              setData({ ...data, patient_birth_date: e.target.value })
            }
            value={parsedPatientBirthdate}
          />
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
            onChange={(e) => setData({ ...data, doctor_name: e.target.value })}
            value={data.doctor_name}
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
              setData({ ...data, doctor_last_name: e.target.value })
            }
            value={data.doctor_last_name}
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
            value={data.rut_doctor}
            disabled
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputMedicalCenter" className="form-label">
            Centro Médico
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, centro: e.target.value })}
            value={data.centro}
          >
            <option value="1">Hospital Barros Luco</option>
            <option value="2">Hospital Del Salvador</option>
            <option value="3">Hospital Metropolitano</option>
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="inputWorkType" className="form-label">
            Tipo de trabajo
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, tipo_trabajo: e.target.value })}
            value={data.tipo_trabajo}
          >
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
            onChange={(e) => setData({ ...data, protesis: e.target.value })}
            value={data.protesis}
          >
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
            onChange={(e) => setData({ ...data, completitud: e.target.value })}
            value={data.completitud}
          >
            <option value="1">Total</option>
            <option value="2">Parcial</option>
          </select>
        </div>
        <div className="col-6">
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
            onChange={(e) => setData({ ...data, ubicacion: e.target.value })}
            value={data.ubicacion}
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
            onChange={(e) => setData({ ...data, indicaciones: e.target.value })}
            value={data.indicaciones}
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputBill" className="form-label">
            Factura
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, tipo_factura: e.target.value })}
            value={data.tipo_factura}
          >
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
            onChange={(e) =>
              setData({ ...data, fecha_facturacion: e.target.value })
            }
            value={parsedBillingDate}
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputLicence" className="form-label">
            Licencia
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, licencia: e.target.value })}
            value={data.licencia}
          >
            <option value="1">2069-67-LP18</option>
          </select>
        </div>
        <div className="col-4 offset-3">
          <button type="submit" className="btn btn-success w-50">
            Editar orden
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

export default EditOrder;
