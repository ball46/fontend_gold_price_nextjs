import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import jwt_decode from 'jwt-decode';
import {Button, Modal} from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from "axios"

export default function Dashboard() {
    axios.defaults.baseURL = 'http://localhost/goldPrice';

    const router = useRouter();
    const [name, setName] = useState("");
    const [data, setData] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', bid: '', ask: '',
    });
    const [formEditData, setFormEditData] = useState({
        newName: '', bid: '', ask: '',
    });
    //it to show in selected line 2
    const [option, setOption] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    //it uses in updateData only
    const [selected, setSelected] = useState("");
    const token = Cookies.get('jwt_token');

    const [decodedToken, setDecodedToken] =useState({
        admin: 0,
        email: "",
        name: "",
    });
    async function decodeToken() {
        try {
            setDecodedToken(await jwt_decode(token));
        } catch (e) {
            console.log("Error decoding");
        }
    }

    const updateData = async () => {
        const response = await axios.get('/price/all');
        const uniqueNames = [...new Set(response.data.map(obj =>
            selected === "time" ? obj.time : selected === "name" ? obj.name : selected === "user_name_update" ?
                obj.user_name_update : ''))];
        setOption(uniqueNames);
        setData(response.data);
        decodeToken();
    };

    const handleLogoutClick = () => {
        document.cookie = 'jwt_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push("/");
    }

    //use when starting page
    useEffect(() => {
        updateData();
    }, []);

    //when data is changed
    useEffect(() => {
        updateData();
    }, [data]);

    const handleFormChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    //when click submit button
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const currentTime = new Date();
            const time = currentTime.getHours() + ":" +
                (currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes());
            const username = decodedToken.name; // replace with the actual username
            const body = {
                ...formData,
                time: time,
                user_name: username,
            };
            await axios.post(`/user/post`, body);
            // Reset the form data
            setFormData({name: '', bid: '', ask: ''});
            // Fetch the updated data and refresh the dashboard
            updateData();
            setShowAddModal(false); // close the form
        } catch (error) {
            console.error(error);
        }
    };

    const handleFormEditChange = (event) => {
        setFormEditData({...formEditData, [event.target.name]: event.target.value});
    };

    const handleEditClick = (obj) => {
        setFormEditData({
            newName: obj.name,
            bid: obj.purchase_price,
            ask: obj.sell_off_price,
        });
        setName(obj.name);
        setShowEditModal(true);
    };

    const handleFormSubmitEdit = async (event) => {
        event.preventDefault();
        try {
            const currentTime = new Date();
            const time = currentTime.getHours() + ":" +
                (currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes());
            const username = decodedToken.name; // replace with the actual username
            const body = {
                ...formEditData,
                time: time,
                user_name: username,
                name: name,
            };
            await axios.put(`/user/put`, body);
            // Reset the form data
            setFormEditData({newName: '', bid: '', ask: ''});
            // Fetch the updated data and refresh the dashboard
            updateData();
            setShowEditModal(false); // close the form
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (name) => {
        setName(name);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            console.log('delete');
            const username = decodedToken.name;
            const body = {
                name: name,
                user_name: username,
            };
            console.log(body);
            await axios.delete(`/user/delete`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: body
                }
            );
            updateData();
            setShowDeleteModal(false); // close the form
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleUpdateGoldPriceClick = () => {
        axios.post('/inputData');
        updateData();
    };

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const [showInvalidFileModal, setShowInvalidFileModal] = useState(false);
    const [showNotHaveFileModal, setShowNotHaveFileModal] = useState(false);

    const handleInvalidFileCancel = () => {
        setShowInvalidFileModal(false);
    };

    const handleNotHaveFileCancel = () => {
        setShowNotHaveFileModal(false);
    };

    const handleUpdateFile = async (file) => {
        if (!file) {
            setShowNotHaveFileModal(true);
            return;
        }

        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes()}`;

        const formData = new FormData();
        formData.append("time", currentTime);
        formData.append("name", decodedToken.name);
        // Check the file extension to determine the appropriate key
        const fileExtension = file.name.split('.').pop();

        if (fileExtension === 'csv') {
            formData.append("type", "csv");
            formData.append("csvFile", file);
        } else if (fileExtension === 'txt') {
            formData.append("type", "text");
            formData.append("file", file);
        } else {
            // Display a pop-up modal if the file is not a CSV or TXT file
            setShowInvalidFileModal(true);
            return;
        }

        try {
            const response = await axios.post("/user/post/all", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("File uploaded successfully");
            console.log(response);
            updateData();
        } catch (error) {
            console.log("Failed to upload file");
            console.log(error);
        }
    };

    return (
        <div className="container">
            {/*header*/}
            <div>
                <h1 className="text-center mb-4">Dashboard</h1>
                <div className="mb-3">
                    <p className="mr-2">Welcome to goldPrice page, {decodedToken.name} !</p>
                    <button
                        type="button"
                        className="btn btn-secondary float-right"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add New Data
                    </button>
                    <button
                        type="button"
                        className="btn btn-success ml-2"
                        onClick={handleUpdateGoldPriceClick}
                    >
                        Update Gold price
                    </button>
                    <div className="form-group">
                        <label htmlFor="fileInput">Select File:</label>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="fileInput"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleUpdateFile(selectedFile)
                    }>
                        Update File (เฉพาะ File ชนิด textFile (.txt) หรือ csvFile (.csv) เท่านั้น
                    </button>
                    <select
                        className="form-select"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        <option value="">Select type option</option>
                        <option value="time">Time</option>
                        <option value="name">Name</option>
                        <option value="user_name_update">Username Update</option>
                    </select>
                    <select className="form-select"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option value="">Select an option</option>
                        {option.map((option) => (
                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/*table to show all data*/}
            <table className="table">
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Purchase Price</th>
                    <th>Sell-off Price</th>
                    <th>Username Update</th>
                </tr>
                </thead>
                <tbody>
                {selectedOption === '' ? (
                    // when not select
                    data.map((obj, index) => (
                        <tr key={index}>
                            <td>{obj.time.split(':').slice(0, 2).join(':')}</td>
                            <td>{obj.name}</td>
                            <td>{obj.purchase_price}</td>
                            <td>{obj.sell_off_price}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    {obj.user_name_update}
                                    {obj.user_name_update === decodedToken.name && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-primary ml-2 mr-2"
                                                onClick={() => handleEditClick(obj)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteClick(obj.name)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    // when is select something
                    data
                        .filter((obj) => (
                            selected === "time" ? obj.time :
                                selected === "name" ? obj.name :
                                    selected === "user_name_update" ?
                                        obj.user_name_update : '') === selectedOption)
                        .map((obj, index) => (
                            <tr key={index}>
                                <td>{obj.time}</td>
                                <td>{obj.name}</td>
                                <td>{obj.purchase_price}</td>
                                <td>{obj.sell_off_price}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {obj.user_name_update}
                                        {obj.user_name_update === decodedToken.name && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-primary ml-2 mr-2"
                                                    onClick={() => handleEditClick(obj)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDeleteClick(obj.name)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                )}
                </tbody>
            </table>

            {/*form to add new data*/}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="nameInput">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nameInput"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="purchasePriceInput">Purchase Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="purchasePriceInput"
                                name="bid"
                                value={formData.bid}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sellOffPriceInput">Sell-off Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="sellOffPriceInput"
                                name="ask"
                                value={formData.ask}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Submit
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

            {/*form to edit data*/}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleFormSubmitEdit}>
                        <div className="form-group">
                            <label htmlFor="nameInput">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nameInput"
                                name="newName"
                                value={formEditData.newName}
                                onChange={handleFormEditChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="purchasePriceInput">Purchase Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="purchasePriceInput"
                                name="bid"
                                value={formEditData.bid}
                                onChange={handleFormEditChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sellOffPriceInput">Sell-off Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="sellOffPriceInput"
                                name="ask"
                                value={formEditData.ask}
                                onChange={handleFormEditChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Submit
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Modal for delete confirmation */}
            <Modal
                show={showDeleteModal}
                onHide={handleDeleteCancel}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this data?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for invalid file type */}
            <Modal
                show={showInvalidFileModal}
                onHide={handleInvalidFileCancel}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Invalid File Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>The file you selected is not a CSV or text file.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleInvalidFileCancel}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for nto have file */}
            <Modal
                show={showNotHaveFileModal}
                onHide={handleNotHaveFileCancel}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Invalid File Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>No file selected.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleNotHaveFileCancel}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};