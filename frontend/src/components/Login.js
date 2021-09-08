import React, { useContext, useRef } from "react";
import UserContext from "../contexts/UserContext";
import { create } from "../api/game";
import "./login.scss"
const Login = () => {
    const { user, updateUser } = useContext(UserContext)
    const value = useContext(UserContext);
    console.log(value);
    console.log(value.user);

    console.log(updateUser);
    const userRef = useRef(null);

    const submitUser = () => {
        updateUser({
            username: userRef.current.value
        });
        // const response = create().then(function(response) {
        //     response.data.code;
        // });
        
    }

    return (
        <div className="login">
            <div className="label">Enter your name:</div>
            <input name="name" ref={userRef}/>
            <button onClick={submitUser}>Submit</button>
        </div>
    )
}

export default Login;

