import axios from "axios";
import React, {useState} from "react";
import {useRouter} from "next/router";

export default function Home() {
    axios.defaults.baseURL = 'http://localhost/goldPrice';

    const router = useRouter();
    const [check, setCheck] = useState({email: '', password: ''});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.get(`/user/login/${check.email}/${check.password}`);
            const jwt_token = resp.data;
            document.cookie = `jwt_token=${jwt_token}`;

            await router.push({pathname: "/dashboard"});
        } catch (error) {
            alert('User not found');
        }
    };

    const handleRegister = () => {
        router.push('/register');
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCheck({...check, [name]: value});
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">$ Gold Price $</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                name="email"
                                value={check.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="password"
                                value={check.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mr-2">
                            Login
                        </button>

                        <button type="button" className="btn btn-secondary" onClick={handleRegister}>
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
