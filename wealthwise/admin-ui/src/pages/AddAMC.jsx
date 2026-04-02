import React, { useState } from "react";
import API from "../services/api";

function AddAMC() {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/admin/amc",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("AMC Added");
    } catch (err) {
      alert("Error adding AMC");
    }
  };

  return (
    <div>
      <h2>Add AMC</h2>

      <input
        placeholder="AMC Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddAMC;