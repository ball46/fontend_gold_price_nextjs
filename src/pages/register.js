import axios from "axios";
import React, {useState} from "react";
import {useRouter} from "next/router";

export default function Register() {
    axios.defaults.baseURL = 'http://localhost/goldPrice';

    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formIsValid()) {
            return;
        }
        try {
            const {email, password} = formData;
            await axios.post(`/user/register`, {
                email,
                password,
            });
            await router.push("/");
        } catch (error) {
            alert("Error registering user");
        }
    };


    const formIsValid = () => {
        const errors = {};
        if (!formData.email) {
            window.alert("Email is required");
            errors.email = "Email is required";
        }
        if (!formData.password) {
            window.alert("Password is required");
            errors.password = "Password is required";
        }
        if (formData.password !== formData.confirmPassword) {
            window.alert("Passwords do not match");
            errors.confirmPassword = "Passwords do not match";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="formBasicEmail">Email address</label>
                            <input type="email" className="form-control" id="formBasicEmail"
                                   aria-describedby="emailHelp" placeholder="Enter email" name="email"
                                   value={formData.email} onChange={handleChange} isInvalid={!!formErrors.email}/>
                            <div className="invalid-feedback">{formErrors.email}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="formBasicPassword">Password</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} className="form-control" id="formBasicPassword"
                                       placeholder="Password" name="password" value={formData.password}
                                       onChange={handleChange} isInvalid={!!formErrors.password} />
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                    </button>
                                </div>
                                <div className="invalid-feedback">{formErrors.password}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="formBasicConfirmPassword">Confirm Password</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"} className="form-control" id="formBasicConfirmPassword"
                                       placeholder="Confirm Password" name="confirmPassword"
                                       value={formData.confirmPassword} onChange={handleChange}
                                       isInvalid={!!formErrors.confirmPassword} />
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                    </button>
                                </div>
                                <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mr-2">Register</button>
                        <button type="button" className="btn btn-secondary"
                                onClick={() => router.push("/")}>Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}