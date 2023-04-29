import axios from "axios";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {Button, Modal} from "react-bootstrap";

export default function Register() {
    axios.defaults.baseURL = 'http://localhost/goldPrice';

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [showNameError, setShowNameError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false);

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
            const {name, email, password} = formData;
            await axios.post(`/user/register`, {
                name,
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
        if (!formData.name) {
            setShowNameError(true);
            errors.name = "Name is required";
        }
        if (!formData.email) {
            setShowEmailError(true);
            errors.email = "Email is required";
        }
        if (!formData.password) {
            setShowPasswordError(true);
            errors.password = "Password is required";
        }
        if (formData.password !== formData.confirmPassword) {
            setShowConfirmPasswordError(true);
            errors.confirmPassword = "Passwords do not match";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNameError = () => {
        setShowNameError(false);
    };

    const handleEmailError = () => {
        setShowEmailError(false);
    };

    const handlePasswordError = () => {
        setShowPasswordError(false);
    };

    const handleConfirmPasswordError = () => {
        setShowConfirmPasswordError(false);
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    {/*Header*/}
                    <h1 className="text-center mb-4">Register</h1>
                    <form onSubmit={handleSubmit}>
                        {/*Name*/}
                        <div className="form-group">
                            <label htmlFor="formBasicName">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="formBasicName"
                                aria-describedby="nameHelp"
                                placeholder="Enter name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!formErrors.name}
                            />
                            <div className="invalid-feedback">{formErrors.name}</div>
                        </div>

                        {/*Email*/}
                        <div className="form-group">
                            <label htmlFor="formBasicEmail">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="formBasicEmail"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!formErrors.email}
                            />
                            <div className="invalid-feedback">{formErrors.email}</div>
                        </div>

                        {/*Password*/}
                        <div className="form-group">
                            <label htmlFor="formBasicPassword">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="formBasicPassword"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!formErrors.password}
                                />
                                <div className="input-group-append">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide Password" : "Show Password"}
                                    </button>
                                </div>
                                <div className="invalid-feedback">{formErrors.password}</div>
                            </div>
                        </div>

                        {/*Confirm Password*/}
                        <div className="form-group">
                            <label htmlFor="formBasicConfirmPassword">Confirm Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="formBasicConfirmPassword"
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!formErrors.confirmPassword}
                                />
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "Hide Password" : "Show Password"}
                                    </button>
                                </div>
                                <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                            </div>
                        </div>

                        {/*button*/}
                        <button
                            type="submit"
                            className="btn btn-primary mr-2"
                        >
                            Register
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => router.push("/")}
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            </div>

            {/*Modal for show Name is required*/}
            <Modal show={showNameError} onHide={handleNameError}>
                <Modal.Header closeButton>
                    <Modal.Title>Blank Bar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Name is required.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleNameError}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Modal for show Email is required*/}
            <Modal show={showEmailError} onHide={handleEmailError}>
                <Modal.Header closeButton>
                    <Modal.Title>Blank Bar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Email is required.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEmailError}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Modal for show Password is required*/}
            <Modal show={showPasswordError} onHide={handlePasswordError}>
                <Modal.Header closeButton>
                    <Modal.Title>Blank Bar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Password is required.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePasswordError}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Modal for show Confirm Password is required*/}
            <Modal show={showConfirmPasswordError} onHide={handleConfirmPasswordError}>
                <Modal.Header closeButton>
                    <Modal.Title>Blank Bar</Modal.Title>
                </Modal.Header>
                <Modal.Body>Passwords do not match.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirmPasswordError}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}