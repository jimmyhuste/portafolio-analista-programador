import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChileanRutify from "chilean-rutify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertComponent from "./components/AlertComponent";
import { DotSpinner } from "@uiball/loaders";
import Swal from "sweetalert2";

function EditUser() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
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
  const [name, setName] = useState({ name: "", lastName: "" });
  const [nameMessage, setNameMessage] = useState("");
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false);
  const [rutMessage, setRutMessage] = useState("");
  const [passErrorMessage, setPassErrorMessage] = useState(false);
  const [parsedDate, setParsedDate] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState(false);
  const [lastNameMessage, setLastNameMessage] = useState("");
  const [birthDateErrorMessage, setBirthDateErrorErrorMessage] =
    useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = useState(false);
  const [rutErrorMessage, setRutErrorMessage] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  const swalEdited = Swal.mixin({
    customClass: {
      confirmButton: "close-button",
      title: "title",
    },
    buttonsStyling: false,
  });

  const handleClose = () => {
    setPassErrorMessage(false);
  };
  const handleCloseEmpty = () => {
    setEmptyFieldsMessage(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/persona/" + id, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        const retrievedDate = new Date(res.data.data.birthDate);
        retrievedDate.setDate(retrievedDate.getDate() - 1);
        console.log(res.data.data);
        setData({
          ...data,
          name: res.data.data.name,
          lastName: res.data.data.lastName,
          rut: res.data.data.rut,
          email: res.data.data.email,
          birthDate: retrievedDate,
          address: res.data.data.adress,
          role: res.data.data.nombre_rol,
          phone: res.data.data.phone,
        });
        setName({
          name: res.data.data.name,
          lastName: res.data.data.lastName,
        });
        setDataLoaded(true);
      });
  }, []);

  useEffect(() => {
    const inputDate = new Date(data.birthDate);
    inputDate.setDate(inputDate.getDate() + 1);
    const MyDateStringFormatted =
      inputDate.getFullYear() +
      "-" +
      ("0" + (inputDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + inputDate.getDate()).slice(-2);
    console.log(MyDateStringFormatted);
    setParsedDate(MyDateStringFormatted);
  }, [data.birthDate]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if any required fields are empty
    if (
      data.name === "" ||
      data.lastName === "" ||
      data.rut === "" ||
      data.email === "" ||
      data.role === ""
    ) {
      setEmptyFieldsMessage(true);
      return;
    }
    setEmptyFieldsMessage(false);
    // Error handler
    let hasError = false;
    // Validate Name
    const spaceCount = (string) => string.split(" ").length - 1;
    const nameRegex = /^[A-Za-z]*(?:\s[A-Za-z]*){0,2}$/;
    if (!nameRegex.test(data.name) || data.name.length > 100) {
      setNameErrorMessage(true);
      setNameMessage("Sólo se permiten letras");
      if (spaceCount(data.name) > 1) {
        setNameMessage("Máximo 1 espacio");
      }
      hasError = true;
    } else {
      console.log("fixed error name");
      setNameErrorMessage(false); // Reset the error state to false
    }
    // Validate lastName
    if (!nameRegex.test(data.lastName) || data.lastName.length > 100) {
      setLastNameErrorMessage(true);
      setLastNameMessage("Sólo se permiten letras");
      if (spaceCount(data.lastName) > 0) {
        setLastNameMessage("No se permiten espacios");
      }
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
      setRutMessage("Rut invalido");
      const hasDot = data.rut.includes(".");
      const hasHyphen = data.rut.includes("-");
      if (hasDot || !hasHyphen) {
        setRutMessage("Rut debe ser sin puntos y con guión");
      }
      if (data.rut === "") {
        setRutMessage("");
      }
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
    if (
      data.role !== "1" &&
      data.role !== "2" &&
      data.role !== 1 &&
      data.role !== 2
    ) {
      console.log(data.role);
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
    if (typeof data.birthDate === "object") {
      const inputDate = new Date(data.birthDate);
      inputDate.setDate(inputDate.getDate() + 1);
      const date = new Date(inputDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      // Update the data object with the formatted birthDate
      const updatedData = {
        ...data,
        birthDate: formattedDate,
      };
      const formdata = new FormData();
      formdata.append("name", updatedData.name);
      formdata.append("lastName", updatedData.lastName);
      formdata.append("rut", updatedData.rut);
      formdata.append("email", updatedData.email);
      formdata.append("birthDate", updatedData.birthDate);
      formdata.append("address", updatedData.address);
      formdata.append("phone", updatedData.phone);
      formdata.append("password", updatedData.password);
      formdata.append("confirmPassword", updatedData.confirmPassword);
      formdata.append("role", updatedData.role);
      formdata.append("image", updatedData.image);
      console.log(updatedData);
      // Make the axios.put request with the updatedData
      axios
        .put("http://localhost:8081/api/persona/" + id, formdata, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            let timerInterval;
            swalEdited.fire({
              title: "Usuario modificado",
              timer: 3000,
              timerProgressBar: true,
              confirmButtonText: "Cerrar",
              willClose: () => {
                clearInterval(timerInterval);
                navigate("/users");
              },
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      // If the birthDate is not an object, make the axios.put request with the original data
      const formdata = new FormData();
      formdata.append("name", data.name);
      formdata.append("lastName", data.lastName);
      formdata.append("rut", data.rut);
      formdata.append("email", data.email);
      formdata.append("birthDate", data.birthDate);
      formdata.append("address", data.address);
      formdata.append("phone", data.phone);
      formdata.append("password", data.password);
      formdata.append("confirmPassword", data.confirmPassword);
      formdata.append("role", data.role);
      formdata.append("image", data.image);
      console.log(data);
      axios
        .put("http://localhost:8081/api/persona/" + id, formdata, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            let timerInterval;
            swalEdited.fire({
              title: "Usuario modificado",
              timer: 3000,
              timerProgressBar: true,
              confirmButtonText: "Cerrar",
              willClose: () => {
                clearInterval(timerInterval);
                navigate("/users");
              },
            });
          }
        })
        .catch((err) => console.log(err));
    }
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
      <h2>
        Edición de usuario: {name.name} {name.lastName}
      </h2>
      <div className="col-12">
        {emptyFieldsMessage && (
          <AlertComponent
            emptyFieldsMessage={emptyFieldsMessage}
            handleCloseEmpty={handleCloseEmpty}
          />
        )}
      </div>
      {dataLoaded && (
        <form className="row g-3 p-4" onSubmit={handleSubmit}>
          <div className="col-12 col-md-6">
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
              value={data.name}
            />
            {nameErrorMessage && (
              <div className="col-12">
                <div style={styles.error} className={``}>
                  <span>{nameMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
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
              value={data.lastName}
            />
            {lastNameErrorMessage && (
              <div className="col-12">
                <div style={styles.error} className={``}>
                  <span>{lastNameMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputRut" className="form-label">
              Rut *
            </label>
            <input
              type="text"
              className="form-control"
              id="inputRut"
              placeholder="11.111.111-1"
              autoComplete="off"
              value={data.rut}
              disabled
            />
            {rutErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>{rutMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
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
              value={data.email}
            />
            {emailErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Máximo 100 carácteres</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
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
              value={parsedDate}
            />
            {birthDateErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Fecha inválida </span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
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
              value={data.address}
            />
          </div>
          <div className="col-12 col-md-6">
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
          </div>
          <div className="col-12 col-md-6">
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
          <div>
            {passErrorMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show d-flex justify-content-between"
                role="alert"
              >
                <strong>La contraseña no coincide</strong>
                <button type="button" className="close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="inputRole" className="form-label">
              Rol *
            </label>
            <select
              className="form-select mb-3"
              onChange={(e) => setData({ ...data, role: e.target.value })}
              value={data.role}
            >
              <option value="1">Administrador</option>
              <option value="2">Laboratorista</option>
            </select>
            {roleErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Debe seleccionar un rol</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
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
              value={data.phone}
            />
            {phoneErrorMessage && (
              <div className="col-12">
                <div style={styles.error}>
                  <span>Sólo se permiten números</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 offset-0 col-md-8 offset-md-2">
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
          <div className="col-12 col-sm-6 col-md-4 offset-md-2 col-lg-3 offset-lg-3">
            <button type="submit" className="btn btn-success w-100">
              Editar
            </button>
          </div>
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <button
              className="btn btn-danger w-100 btn-secondary"
              onClick={() => navigate("/users")}
            >
              Volver
            </button>
          </div>
        </form>
      )}
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

export default EditUser;

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
