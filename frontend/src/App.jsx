import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import Footer from"./components/Footer"
import Dashbaord from "./pages/Dashboard"

function App(){

return(

<BrowserRouter>
<Navbar/>
<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/dashboard" element={<Dashbaord/>}/>

</Routes>
<Footer/>
</BrowserRouter>

)

}

export default App