import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8081/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        if (res.data.Status !== "Success") {
          navigate("/login");
        } else {
          setData(res.data.responseData);
          console.log(res.data.responseData);
        }
      })
      .catch((err) => {
        navigate("/login");
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px 3 p-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admins</h4>
          </div>
          <hr />
          <div className="">
            <h5>Total: {data.admins}</h5>
          </div>
        </div>
        <div className="px 3 p-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Labs</h4>
          </div>
          <hr />
          <div className="">
            <h5>Total: {data.labos}</h5>
          </div>
        </div>
        <div className="px 3 p-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Ordenes</h4>
          </div>
          <hr />
          <div className="">
            <h5>Total: {data.orders}</h5>
          </div>
        </div>
      </div>
      {/* Lista de admins */}
      <div className="mt-4 px-5 p-3">
        <h3>Lista de administradores</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
