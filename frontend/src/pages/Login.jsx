import { useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()

        try {

            const res = await API.post("/login", {
                username,
                password
            })


            navigate("/dashboard")

        } catch (err) {
            alert("login failed")
        }

    }

    return (

        <div style={{ padding: "40px" }}>

            <h2>Login</h2>

            <form onSubmit={login}>

                <input
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">Login</button>

            </form>

        </div>

    )

}

export default Login