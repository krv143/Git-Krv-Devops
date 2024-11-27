
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'; // Import Bootstrap components for modal
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs for addresses
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RouteIcon from '@mui/icons-material/Route';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';

const AddressManager = () => {
  const [addresses, setAddresses] = useState([
    {
      id: uuidv4(),
      type: 'primary',
      address: '123 Main St, Springfield, IL 62701',
    },
    {
      id: uuidv4(),
      type: 'secondary',
      address: '456 Oak St, Springfield, IL 62702',
    },
    {
      id: uuidv4(),
      type: 'secondary',
      address: '789 Pine St, Springfield, IL 62703',
    },
  ]);

  const [newAddress, setNewAddress] = useState('');
  const [addressType, setAddressType] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSecondaryAddresses, setShowSecondaryAddresses] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    details: '',
    category: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmationModal, setConfirmationModal] = useState(false);

  const states = ['Andhra Pradesh', 'Telangana'];
  const districts = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
    'Telangana': ['Hyderabad', 'Warangal', 'Khammam'],
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    if (
      newAddress.trim() === '' ||
      addressType.trim() === '' ||
      state.trim() === '' ||
      district.trim() === '' ||
      pincode.trim() === ''
    ) {
      alert('Please fill in all the fields.');
      return;
    }

    if (addresses.length >= 4) {
      alert('You can only add up to 4 addresses.');
      return;
    }

    const newAddr = {
      id: uuidv4(),
      type: addressType,
      address: newAddress,
      state,
      district,
      pincode,
    };

    setAddresses((prevAddresses) => [...prevAddresses, newAddr]);
    resetAddressForm();
    setShowModal(false);
  };

  // Reset address form fields
  const resetAddressForm = () => {
    setNewAddress('');
    setAddressType('');
    setState('');
    setDistrict('');
    setPincode('');
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle file deletion
  const handleFileDelete = (index) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles.splice(index, 1);
    setUploadedFiles(newUploadedFiles);
  };

  // Handle preview and confirmation on ticket submission
  const handleSaveTicket = (e) => {
    e.preventDefault();

    // Ensure all fields are filled before submitting
    if (
      !formData.subject ||
      !formData.details ||
      !formData.category ||
      !assignedTo
    ) {
      setAlertMessage('Please fill in all mandatory fields.');
      setShowAlert(true);
      return;
    }

    setAlertMessage('Ticket has been submitted successfully! Customer Care will contact you shortly.');
    setShowAlert(true);
  };

  // Handle secondary address selection
  const handleSecondaryAddressSelect = (id) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === id
        ? { ...address, type: 'primary' }
        : address.type === 'primary'
        ? { ...address, type: 'secondary' }
        : address
    );
    setAddresses(updatedAddresses);
    setShowSecondaryAddresses(false); // Collapse secondary addresses view
  };

  // Handle address deletion
  const handleAddressDelete = (id) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);
  };

  // Handle address editing
  const handleAddressEdit = (id) => {
    const addressToEdit = addresses.find((address) => address.id === id);
    if (addressToEdit) {
      setNewAddress(addressToEdit.address);
      setAddressType(addressToEdit.type);
      setState(addressToEdit.state);
      setDistrict(addressToEdit.district);
      setPincode(addressToEdit.pincode);
      setShowModal(true);
      handleAddressDelete(id); // Remove the address to re-add it after edit
    }
  };

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [uploadedFiles]);

  return (
    <div className="d-flex flex-row justify-content-start align-items-start">
    <div className="m-3 p-0 sde_mnu">
            <div className="_mnu_dv">
              <span><DashboardIcon /> Dashboard</span>
            </div>
            <div className="_mnu_dv">
              <span><SupportAgentIcon /> Raise Ticket</span>
            </div>
            <div className="_mnu_dv">
              <span><PersonAddIcon /> Add Member</span>
            </div>
            <div className="_mnu_dv">
              <span><RouteIcon /> Track Ticket Status</span>
            </div>
            <div className="_mnu_dv">
              <span><NotificationsIcon /> Notifications</span>
            </div>
            <div className="_mnu_dv">
              <span><PaymentsIcon /> Buy Products</span>
            </div>
            <div className="_mnu_dv">
              <span><InventoryIcon /> Orders</span>
            </div>
            <div className="_mnu_dv">
              <span><ShoppingCartIcon /> Cart</span>
            </div>
            <div className="_mnu_dv">
              <span><AccountCircle /> My Accounts</span>
            </div>
          </div>
    <div className="container m-1">
      <h1 className="text-center mb-2">Raise a Ticket</h1>

      {/* Ticket Form */}
      <Form onSubmit={handleSaveTicket}>
        {/* Display primary address with "Change Address" link */}
        <Form.Group>
          <label>Address</label>
          <button
            className="btn btn-link ml-2"
            onClick={() => setShowSecondaryAddresses(true)}
          >
            Change Address
          </button>
        </Form.Group>

        {/* Show primary address */}
        {addresses
          .filter((addr) => addr.type === 'primary')
          .map((address) => (
            <div
              key={address.id}
              className="list-group-item d-flex justify-content-between align-items-center bg-white text-dark"
            >
              <div>
                <span className="ml-2">{address.address}</span>
                <br />
                <small className="text-muted">Primary Address</small>
              </div>
            </div>
          ))}

        {/* Show secondary addresses when "Change Address" is clicked */}
        {showSecondaryAddresses && (
          <>
            <div className="list-group">
              {addresses
                .filter((addr) => addr.type === 'secondary')
                .map((address) => (
                  <div
                    key={address.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <input
                        type="radio"
                        name="address"
                        checked={address.type === 'primary'}
                        onChange={() => handleSecondaryAddressSelect(address.id)}
                      />
                      <span className="ml-2">{address.address}</span>
                      <br />
                      <small className="text-muted">Secondary Address</small>
                    </div>
                    <div>
                      <button
                        className="btn btn-warning btn-sm mx-1"
                        onClick={() => handleAddressEdit(address.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm mx-1"
                        onClick={() => handleAddressDelete(address.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-3">
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                Add Address
              </button>
            </div>
          </>
        )}

        {/* Subject */}
        <Row>
          <Col md={12}>
            <Form.Group>
              <label>Subject</label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                required
              />
            </Form.Group>
          </Col>
          {/* Assigned To */}

        </Row>

        {/* Details */}
        <Form.Group>
          <label>Details</label>
          <Form.Control
            as="textarea"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="4"
            placeholder="Enter details"
            required
          />
        </Form.Group>

        {/* Category */}
        <Row>
          <Col md={6}>
            <Form.Group>
              <label>Category</label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option>Technical Support</option>
                <option>Billing</option>
                <option>General Inquiry</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
        <Col md={6}>
            <Form.Group>
              <label>Assigned To</label>
              <Form.Control
                as="select"
                name="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Customer Care">Customer Care</option>
                <option value="Admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        {/* File Upload */}
        <div className="form-group mt-4">
          <label>Upload Photos & Videos</label>
          <div className="d-flex flex-column align-items-center">
            <button
              className="btn btn-outline-secondary"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload
            </button>
            <input
              type="file"
              id="fileInput"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="d-none"
            />
          </div>
        </div>

        {/* File Preview */}
        <div className="preview-container mt-3">
          {uploadedFiles.length > 0 &&
            uploadedFiles.map((file, index) => {
              const fileUrl = URL.createObjectURL(file);
              return (
                <div key={index} className="file-preview">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() => handleFileDelete(index)}
                  >
                    Delete
                  </button>
                  <div className="mt-2">
                    {/* Preview the file (image or video) */}
                    {file.type.startsWith('image') && (
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className="img-fluid"
                        style={{ maxWidth: '200px' }}
                      />
                    )}
                    {file.type.startsWith('video') && (
                      <video
                        controls
                        src={fileUrl}
                        className="img-fluid"
                        style={{ maxWidth: '200px' }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Save Ticket Button */}
        <div className="mt-4">
          <Button variant="success" type="submit">
            Save Ticket
          </Button>
        </div>
      </Form>

      {/* Address Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{newAddress ? 'Edit Address' : 'Add Address'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter address"
            />
          </Form.Group>

          <Form.Group controlId="addressType">
            <Form.Label>Address Type</Form.Label>
            <Form.Control
              as="select"
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
            >
              <option value="">Select Address Type</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Control
              as="select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="district">
            <Form.Label>District</Form.Label>
            <Form.Control
              as="select"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {districts[state]?.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="pincode">
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode"
            />
          </Form.Group>

          <Button variant="primary" onClick={handleAddAddress}>
            {newAddress ? 'Save Address' : 'Add Address'}
          </Button>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={confirmationModal} onHide={() => setConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Ticket Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to save this ticket?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationModal(false)}>
            No
          </Button>
          <Button variant="primary" onClick={handleSaveTicket}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Alert */}
      {showAlert && (
        <div className="mt-4 alert alert-info" role="alert">
          {alertMessage}
        </div>
      )}
    </div>
    </div>
  );
};

export default AddressManager;