import { Link } from "react-router-dom"

function Navbar(){

return(

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"15px 40px",
background:"#1e293b",
color:"white"
}}>

<h2>WealthWise</h2>

<div style={{display:"flex",gap:"20px"}}>

<Link style={{color:"white",textDecoration:"none"}} to="/">
Login
</Link>

</div>

</div>

)

}

export default Navbar