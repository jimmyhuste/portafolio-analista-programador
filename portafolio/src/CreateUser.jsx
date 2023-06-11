import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import ChileanRutify from "chilean-rutify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertComponent from "./components/AlertComponent";

function CreateUser() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    name: "",
    lastName: "",
    rut: "",
    email: "",
    birthDate: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
    image: "",
    phone: "",
  });
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [passErrorMessage, setPassErrorMessage] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(false);
  const [birthDateErrorMessage, setBirthDateErrorErrorMessage] =
    useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = useState(false);
  const [rutErrorMessage, setRutErrorMessage] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState(false);

  const notify = () =>
    toast.warn(
      "Archivo invalido, debe seleccionar una imagen de formato JPG, PNG o JPEG.",
      {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );

  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if any required fields are empty
    if (
      data.name === "" ||
      data.lastName === "" ||
      data.rut === "" ||
      data.email === "" ||
      data.password === "" ||
      data.confirmPassword === "" ||
      data.role === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    // Error handler
    let hasError = false;
    // Validate Name
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(data.name) || data.name.length > 100) {
      setNameErrorMessage(true);
      hasError = true;
    } else {
      setNameErrorMessage(false);
    }
    // Validate lastName
    if (!nameRegex.test(data.lastName) || data.lastName.length > 100) {
      setLastNameErrorMessage(true);
      hasError = true;
    } else {
      setLastNameErrorMessage(false);
    }
    // Validate rut
    const validateRut = (rut) => {
      const rutRegex = /^\d{1,8}-[\dk]$/;
      return rutRegex.test(rut);
    };
    if (!validateRut(data.rut) || !ChileanRutify.validRut(data.rut)) {
      setRutErrorMessage(true);
      hasError = true;
    } else {
      setRutErrorMessage(false);
    }
    // Validate email
    if (data.email.length > 100) {
      setEmailErrorMessage(true);
      hasError = true;
    } else {
      setEmailErrorMessage(false);
    }
    // Validate birth date
    const currentDate = new Date();
    const selectedDate = new Date(data.birthDate);
    const minDate = new Date("1900-01-01");
    if (selectedDate < minDate || selectedDate > currentDate) {
      setBirthDateErrorErrorMessage(true);
      hasError = true;
    } else {
      setBirthDateErrorErrorMessage(false);
    }
    // Validate passwords
    if (data.password !== data.confirmPassword) {
      setPassErrorMessage(true);
      hasError = true;
    } else {
      setPassErrorMessage(false);
    }
    // Validate role
    if (data.role !== "1" && data.role !== "2") {
      setRoleErrorMessage(true);
      hasError = true;
    } else {
      setRoleErrorMessage(false);
    }
    // Validate phone
    const phoneRegex = /^[0-9]*$/;
    if (!phoneRegex.test(data.phone) || data.phone.length > 15) {
      setPhoneErrorMessage(true);
      hasError = true;
    } else {
      setPhoneErrorMessage(false);
    }
    if (hasError) {
      return;
    }
    const formdata = new FormData();
    formdata.append("rut", data.rut);
    formdata.append("password", data.password);
    formdata.append("imagen", data.image);
    formdata.append("name", data.name);
    formdata.append("lastName", data.lastName);
    formdata.append("birthDate", data.birthDate);
    formdata.append("adress", data.address);
    formdata.append("phone", data.phone);
    formdata.append("email", data.email);
    formdata.append("nombre_rol", data.role);
    formdata.append("confirmPassword", data.confirmPassword);
    console.log(formdata);
    console.log(data);
    axios
      .post("http://localhost:8081/api/persona", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.Status !== "Error") {
          navigate("/users");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          console.log(err);
          notify();
        } else {
          console.log(err.response.data.error);
        }
      });
  };
  return (
    <div className="d-flex flex-column mx-auto align-items-center pt-2 mt-3 border  w-75">
      <h2>Crear nuevo usuario</h2>
      {emptyFieldsMessage && (
        <AlertComponent
          emptyFieldsMessage={emptyFieldsMessage}
          handleCloseEmpty={handleCloseEmpty}
        />
      )}
      <form className="row g-3 p-4" onSubmit={handleSubmit}>
        <div className="col-6">
          <label htmlFor="inputName" className="form-label">
            Nombre *
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            placeholder="Juan"
            autoComplete="off"
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          {nameErrorMessage && (
            <div className="col-12">
              <div style={styles.error} className={``}>
                <span>Solo se permiten letras</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="inputLastName" className="form-label">
            Apellido *
          </label>
          <input
            type="text"
            className="form-control"
            id="inputLastName"
            placeholder="Perez"
            autoComplete="off"
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
          />
          {lastNameErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Solo se permiten letras</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="inputRut" className="form-label">
            Rut *
          </label>
          <input
            type="text"
            className="form-control"
            id="inputRut"
            placeholder="11111111-1"
            autoComplete="off"
            onChange={(e) => setData({ ...data, rut: e.target.value })}
          />
          {rutErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Rut invalido</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="inputEmail" className="form-label">
            Email *
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            placeholder="correo@gmail.com"
            autoComplete="off"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          {emailErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Máximo 100 carácteres</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="inputBirthDate" className="form-label">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            className="form-control"
            id="inputBirthDate"
            placeholder="Ingresar fecha de nacimiento"
            autoComplete="off"
            onChange={(e) => setData({ ...data, birthDate: e.target.value })}
          />
          {birthDateErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Fecha inválida </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="inputAddress" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            placeholder="Ingresar dirección"
            autoComplete="off"
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputPassword" className="form-label">
            Contraseña *
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            placeholder="Ingresar contraseña"
            autoComplete="off"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          {passErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Contraseñas no coinciden</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="inputConfirmPassword" className="form-label">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            className="form-control"
            id="inputConfirmPassword"
            placeholder="Re-ingresar contraseña"
            autoComplete="off"
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
          />
        </div>
        <div className="col-6">
          <label htmlFor="inputRole" className="form-label">
            Rol *
          </label>
          <select
            className="form-select mb-3"
            onChange={(e) => setData({ ...data, role: e.target.value })}
          >
            <option value=""></option>
            <option value="1">Administrador</option>
            <option value="2">Laboratorista</option>
          </select>
        </div>
        {roleErrorMessage && (
          <div className="col-6">
            <div style={styles.error}>
              <span>Debe seleccionar un rol</span>
            </div>
          </div>
        )}
        <div className="col-6">
          <label htmlFor="inputPhone" className="form-label">
            Número telefónico
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPhone"
            placeholder="Ingresar dirección"
            autoComplete="off"
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          {phoneErrorMessage && (
            <div className="col-12">
              <div style={styles.error}>
                <span>Sólo se permiten números</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-8 offset-2">
          <label htmlFor="inputFile" className="form-label">
            Foto de perfil
          </label>
          <input
            type="file"
            className="form-control"
            id="inputFile"
            onChange={(e) => setData({ ...data, image: e.target.files[0] })}
          />
        </div>
        <div className="col-4 offset-3">
          <button type="submit" className="btn btn-success w-50">
            Crear usuario
          </button>
        </div>
        <div className="col-4">
          <button
            className="btn btn-danger w-50 btn-secondary"
            onClick={() => navigate("/users")}
          >
            Volver
          </button>
        </div>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{ color: "black" }}
      />
    </div>
  );
}

export default CreateUser;

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
