import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { useState } from "react";
import"./App.css";
import {
  List,
  Plus,
  Briefcase,
  User,
  Bell
} from "lucide-react";
import { NavLink } from "react-router-dom";

function AddAMC() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("AMC Added: " + name);
    setName("");
  };

  return (
    <div className="card">
      <h2>Add AMC</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter AMC Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
function AMCList() {
  const amcs = ["SBI AMC", "HDFC AMC", "ICICI AMC"];

  return (
    <div>
      <h2>AMC List</h2>
      <ul>
        {amcs.map((amc, index) => (
          <li key={index}>{amc}</li>
        ))}
      </ul>
    </div>
  );
}
function Users() {
  const users = [
    { id: 1, name: "Satish", role: "Admin" },
    { id: 2, name: "User1", role: "Investor" }
  ];

  return (
    <div>
      <h2>Users</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddFund() {
  const [fund, setFund] = useState({
    name: "",
    category: "",
    risk: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Fund: ${fund.name}, Category: ${fund.category}, Risk: ${fund.risk}`
    );
  };

  return (
    <div className="card">
      <h2>Add Fund</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Fund Name"
          onChange={(e) =>
            setFund({ ...fund, name: e.target.value })
          }
        />

        <br /><br />

        <select
          onChange={(e) =>
            setFund({ ...fund, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          <option>Equity</option>
          <option>Debt</option>
          <option>Hybrid</option>
        </select>

        <br /><br />

        <select
          onChange={(e) =>
            setFund({ ...fund, risk: e.target.value })
          }
        >
          <option value="">Select Risk</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <br /><br />

        <button type="submit">Add Fund</button>
      </form>
    </div>
  );
}
function Notifications() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Notification sent: " + message);
    setMessage("");
  };

  return (
    <div className="card">
      <h2>Send Notification</h2>

      <form onsubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
     <div className="main">

  {/* Sidebar */}
  <div className="sidebar">
    <h2>WealthWise</h2>

    <NavLink to="/add-amc">
    <Plus size={18} /> Add AMC
  </NavLink>

  <NavLink to="/amc">
    <List size={18} /> AMC List
  </NavLink>

  <NavLink to="/fund">
    <Briefcase size={18} /> Add Fund
  </NavLink>

  <NavLink to="/users">
    <User size={18} /> Users
  </NavLink>

  <NavLink to="/notifications">
    <Bell size={18} /> Notifications
  </NavLink>
  </div>

  {/* Content */}
  <div className="content">
    <h1>Admin Panel</h1>

    <Routes>
  <Route path="/" element={<AddAMC />} />
  <Route path="/add-amc" element={<AddAMC />} />
  <Route path="/amc" element={<AMCList />} />
  <Route path="/fund" element={<AddFund />} />
  <Route path="/users" element={<Users />} />
  <Route path="/notifications" element={<Notifications />} />
</Routes>
  </div>

</div>
    </BrowserRouter>
  );
}

export default App;
