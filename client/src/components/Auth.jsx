import React,{useState} from 'react'
import Cookies  from 'universal-cookie'
import axios from 'axios'

import signinImage from '../assets/signup.jpg'

//creating instance of a cookie
const cookies = new Cookies()

const initialState = {
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    avatarURL: "",

}

const Auth = () => {

    const[form, setForm] = useState(initialState)
    const[isSignup, setIsSignup] = useState(true)

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
        //console.log(form)
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //submit data collected from fronted to backend to create store user information in database 
        // console.log(form)

        //get all the required data from the form to send it to backend/server(Auth)
        const { username, password, phoneNumber, avatarURL } = form

        //specifying URL in which we are making our request to
        const URL = 'https://medical-pager-altaf.herokuapp.com/auth'

        //making axios call to post in data in URl
        //or making request to the backend
        //and getting token userId and hashedPassword from the backend
        console.log("altaf");
        const { data: {token, userId, hashedPassword, fullName} } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, phoneNumber, avatarURL, 
        })

        console.log("altaf 2")
        //using above value to add them in browser cookies
        cookies.set('token', token)
        cookies.set('username', username)
        cookies.set('fullName', fullName)
        cookies.set('userId', userId)

        if(isSignup) {
            cookies.set('phoneNumber', phoneNumber)
            cookies.set('avatarURL', avatarURL)
            cookies.set('hashedPassword', hashedPassword)   
        }

        //after setting cookie we have to reload our browser
        window.location.reload()

    }

    return (
        //filling all the inputs
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    
                    <form onSubmit={handleSubmit}> 
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div> 
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                                />
                            </div> 
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL">Avatar URL</label>
                                <input
                                    type="text"
                                    name="avatarURL"
                                    placeholder="Avatar URL"
                                    onChange={handleChange}
                                    required
                                />
                            </div> 
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div> 
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="text"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div> 
                        )}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up" : "Sign In" }</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup ? "Already have an account?" : "Dont't have an account?"}
                            <span onClick={switchMode}>
                                {isSignup ? "Sign In" : "Sign Up"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}

export default Auth
