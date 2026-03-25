import AdminAddAmc from "./components/AdminAddAmc";
import AdminAddFund from "./components/AdminAddFund";
import BrowseFunds from "./components/BrowseFunds";

function App() {
  return (
    <div>
      <h1>Wealth Wise Project</h1>

      <hr />

      {/* AMC Section */}
      <AdminAddAmc />

      <hr />

      {/* Fund Section */}
      <AdminAddFund />

      <hr />

      {/* Browse Funds Section */}
      <BrowseFunds />
    </div>
  );
}

export default App;