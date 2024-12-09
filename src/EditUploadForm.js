import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"; // Add this for the required CSS.
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RouteIcon from '@mui/icons-material/Route';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateIcon from '@mui/icons-material/Update';
import { useNavigate, useParams } from 'react-router-dom';

const ProductUpload = () => {
    const { id } = useParams(); // Retrieve the dynamic id from URL
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [productPhotos, setProductPhotos] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productName, setProductName] = useState("");
    const [catalogue, setCatalogue] = useState("");
    const [productSize, setProductSize] = useState("");
    const [units, setUnits] = useState("");
    const [rate, setRate] = useState("");
    const [discount, setDiscount] = useState("");
    const [afterDiscountPrice, setAfterDiscountPrice] = useState("");
    const [specifications, setSpecifications] = useState([{ label: "", value: "" }]);
    const [warranty, setWarranty] = useState("");
    const [moreInfo, setMoreInfo] = useState("");
    
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const productResponse = await fetch(`https://handymanapiservices.azurewebsites.net/api/Product/${id}`);
                if (!productResponse.ok) {
                    throw new Error('Product not found');
                }
                const productData = await productResponse.json();
                setProduct(productData);
                setProductName(productData.productName);
                setCatalogue(productData.catalog);
                setRate(productData.rate);
                setDiscount(productData.discount);
                setAfterDiscountPrice(productData.afterDiscountPrice);
                setSpecifications(productData.specifications || [{ label: "", value: "" }]);
                setWarranty(productData.warranty);
                setMoreInfo(productData.additionalInfo);
                setUploadedFiles(productData.images || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length + uploadedFiles.length > 5) {
            alert("You can only upload up to 5 files.");
            return;
        }
        setProductPhotos([...productPhotos, ...selectedFiles]);
    };

    const handleRemoveFile = (index) => {
        const updatedPhotos = productPhotos.filter((_, i) => i !== index);
        setProductPhotos(updatedPhotos);
    };

     // Handle change of specification field (label or value)
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = value;
    setSpecifications(updatedSpecifications);
  };

  // Handle removal of a specification
  const handleRemoveSpecification = (index) => {
    const updatedSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(updatedSpecifications);
  };

  // Handle adding a new specification
  const handleAddSpecification = () => {
    setSpecifications([...specifications, { label: "", value: "" }]);
  };

  const handleUploadFiles = async () => {
    setLoading(true);
    const uploadedFilesList = [];

    // Loop through selected files and upload each one
    for (let i = 0; i < productPhotos.length; i++) {
        const file = productPhotos[i];
        const fileName = file.name;
        const mimeType = file.type;
        const byteArray = await getFileByteArray(file);

        const response = await uploadFile(byteArray, fileName, mimeType, file);
        if (response) {
            uploadedFilesList.push({
                src: response,
                alt: fileName
            });
        }
    }
    setUploadedFiles(uploadedFilesList);
    setLoading(false);
    setProductPhotos([]); // Reset the file input after upload
};

    const getFileByteArray = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const byteArray = new Uint8Array(reader.result);
                resolve(byteArray);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const uploadFile = async (byteArray, fileName, mimeType, file) => {
        try {
            const formData = new FormData();
            formData.append('file', new Blob([byteArray], { type: mimeType }), fileName);
            formData.append('fileName', fileName);

            const response = await fetch('https://handymanapiservices.azurewebsites.net/api/FileUpload/upload?filename=' + fileName, {
                method: 'POST',
                headers: { 'Accept': 'text/plain' },
                body: formData
            });

            const responseData = await response.text();
            return responseData || '';
        } catch (error) {
            console.error('Error uploading file:', error);
            return '';
        }
    };
    
    const handleRemoveNewFile = (index) => {
        const updatedPhotos = productPhotos.filter((_, i) => i !== index);
        setProductPhotos(updatedPhotos);
    };

    const handleRemoveExistingFile = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            id,
            productName,
            images: uploadedFiles.map(file => ({
                src: file.src,
                alt: file.alt
            })),
            catalog: catalogue,
            colors: ["Red", "Blue", "Green"],
            rate: parseFloat(rate),
            discount: parseFloat(discount),
            afterDiscountPrice: parseFloat(rate) - parseFloat(discount),
            specifications: specifications.map(spec => ({
                label: spec.label,
                value: spec.value
            })),
            warranty,
            additionalInfo: moreInfo
        };

        try {
            const response = await fetch(`https://handymanapiservices.azurewebsites.net/api/product/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Product updated successfully!");
                navigate(`/product-list`);
            } else {
                alert("Failed to update product.");
            }
        } catch (error) {
            alert("An error occurred while updating the product.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>No data available for the selected product.</div>;
    }

    return (
        <div className="d-flex flex-row justify-content-start align-items-start">
            <div className="sde_mnu">
                {/* Sidebar Menu */}
                <div className="_mnu_dv"><span><DashboardIcon /> Dashboard</span></div>
                <div className="_mnu_dv"><span><SupportAgentIcon /> Raise Ticket</span></div>
                <div className="_mnu_dv"><span><PersonAddIcon /> Add Member</span></div>
                <div className="_mnu_dv"><span><RouteIcon /> Track Ticket Status</span></div>
                <div className="_mnu_dv"><span><NotificationsIcon /> Notifications</span></div>
                <div className="_mnu_dv"><span><PaymentsIcon /> Buy Products</span></div>
                <div className="_mnu_dv"><span><InventoryIcon /> Orders</span></div>
                <div className="_mnu_dv"><span><ShoppingCartIcon /> Cart</span></div>
                <div className="_mnu_dv"><span><AccountCircle /> My Accounts</span></div>
            </div>

            <div className="m-3">
                <h3 className="mb-3 text-center">Update Product</h3>
                <div className="bg-white rounded-3 p-3 bx_sdw w-60 m-auto">
                    <form onSubmit={handleSubmit}>
                        {/* Product Name */}
                        <div className="form-group">
                            <label>Product Name <span className="req_star">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                value={product.productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter Product Name"
                            />
                        </div>

                        {/* Catalogue */}
                        <div className="form-group">
                            <label>Catalogue</label>
                            <input
                                type="text"
                                className="form-control"
                                value={catalogue}
                                onChange={(e) => setCatalogue(e.target.value)}
                                placeholder="Enter Catalogue"
                            />
                        </div>

                        {/* Product Size */}
                        <div className="form-group">
                        <label>Size</label>
                        <input
                            type="text"
                            className="form-control"
                            value={productSize}
                            onChange={(e) => setProductSize(e.target.value)}
                            placeholder="Enter Product Size"
                        />
                        </div>

                        {/* Units */}
                        <div className="form-group">
                            <label>Units <span className="req_star">*</span></label>
                            <input type="text"
                            className="form-control"
                            value={units}
                            onChange={(e) => setUnits(e.target.value)}
                            placeholder="Enter Units" />
                        </div>

                        {/* Product Images */}
                        <div className="form-group">
                            <label>Product Photos <span className="req_star">*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                onChange={handleFileChange}
                            />
                            <div className="mt-2">
                                    {productPhotos.map((file, index) => (
                                        <div key={index}>
                                            <p>{file.name}</p>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="btn btn-danger btn-sm px-2 py-1 gap-5"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                                {/* Other inputs */}
                                <div>
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index}>
                                            <img src={file.src} alt={file.alt} width="100" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="btn btn-danger btn-sm px-2 py-1 gap-5"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                <button
                                type="button"
                                className="btn btn-primary mt-2"
                                onClick={handleUploadFiles}
                                disabled={loading || productPhotos.length === 0}
                            >
                                {loading ? 'Uploading...' : 'Upload Files'}
                            </button>
                                </div>


                        {/* Rate */}
                        <div className="form-group">
                            <label>Rate<span className="req_star">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                value={product.rate}
                                onChange={(e) => setRate(e.target.value)}
                                placeholder="Enter Rate"
                            />
                        </div>
                        {/* Discount */}
                        <div className="form-group">
                            <label>Discount</label>
                            <input
                                type="number"
                                className="form-control"
                                value={product.discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder="Enter Discount"
                            />
                        </div>

                        {/* Product Specifications */}
                        <div className="form-group">
                        <label>Product Specifications <span className="req_star">*</span></label>
                        {specifications.map((spec, index) => (
                            <div key={index} className="d-flex gap-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Specification Name"
                                value={spec.label}
                                onChange={(e) => handleSpecificationChange(index, "label", e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Specification Value"
                                value={spec.value}
                                onChange={(e) => handleSpecificationChange(index, "value", e.target.value)} />
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveSpecification(index)}
                            >
                                Remove
                            </button>
                            </div>
                        ))}
                         <input
                            type="text"
                            className="form-control mt-2"
                            id="textInput"
                            placeholder="Optional"
                        />
                        <button type="button" className="btn btn-primary" onClick={handleAddSpecification}>
                            Add Specification
                        </button>
                        </div>

                        {/* Warranty */}
                        <div className="form-group">
                            <label>Warranty</label>
                            <input
                                type="text"
                                className="form-control"
                                value={warranty}
                                onChange={(e) => setWarranty(e.target.value)}
                                placeholder="Enter Warranty"
                            />
                        </div>
                        {/* More Info */}
                        <div className="form-group">
                            <label>More Info</label>
                            <textarea
                                className="form-control"
                                value={moreInfo}
                                onChange={(e) => setMoreInfo(e.target.value)}
                                placeholder="Enter Additional Information"
                            />
                        </div>

                        <div className="d-flex justify-content-between gap-3 mt-3">
                            {/* Update Product Button */}
                            <button
                                type="submit"
                                className="btn btn-success w-100 d-flex justify-content-center align-items-center p-3 shadow-lg"
                            >
                                <UpdateIcon className="me-2" />
                                <span>Update Product</span>
                            </button>

                            {/* View Single Product Button */}
                            <button
                                type="button"
                                className="btn btn-primary w-100 d-flex justify-content-center align-items-center p-3 shadow-lg"
                                onClick={() => navigate('/product-list')}
                            >
                                <VisibilityIcon className="me-2" />
                                <span>View Product</span>
                            </button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductUpload;
