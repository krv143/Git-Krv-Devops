import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RouteIcon from '@mui/icons-material/Route';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useParams, Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';


const App = () => {
  const { id } = useParams(); // Retrieve the dynamic id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // State to store product data
  const [imageUrls, setImageUrls] = useState([]); // State to store images after decoding
  const [loading, setLoading] = useState(true); // To show loading indicator
  const [error, setError] = useState(null); // To store any error
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true); // Set loading to true before starting the fetch

        // Fetch product data using the dynamic `id` from URL
        const productResponse = await fetch(`https://handymanapiservices.azurewebsites.net/api/Product/${id}`);
        if (!productResponse.ok) {
          throw new Error('Product not found');
        }
        const productData = await productResponse.json();
        console.log("Product Data:", productData); // Debugging line
        setProduct(productData);

        // Fetch the images from the second API
        const imageRequests = productData.images?.map((image) =>
          fetch(`https://handymanapiservices.azurewebsites.net/api/FileUpload/download?generatedfilename=${image.src}`)
            .then((res) => res.json())
            .then((data) => ({
              src: image.src,
              imageData: data.imageData,
            }))
        ) || []; // Make sure images is an empty array if undefined

        // Wait for all image requests to finish
        const images = await Promise.all(imageRequests);
        console.log("Decoded Images:", images); // Debugging line
        setImageUrls(images);
      } catch (error) {
        setError(error.message); // Set error message if any error occurs
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    if (id) {
      fetchProductData(); // Fetch product when the `id` is available
    }
  }, [id]); // Run the effect whenever the `id` changes
 // Run the effect whenever the `id` changes// Empty array means this effect runs only once on component mount

  // Ensure product is loaded before rendering
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
    <div className="wrapper">
      <div className="container-fluid mt_50px h-100 d-flex flex-row justify-content-start">
        <div className="d-flex py-3 gap-3">
          <div className="m-0 p-0 sde_mnu">
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

          <div className="main_vw">
            <div className="h3">{product.productName}</div> {/* Display product name */}
            <div className="row bg-white p-3">
              <div className="col-md-6">
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                
                  <div className="carousel-indicators">
                    {imageUrls.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                  <div className="carousel-inner">
                    {imageUrls.map((image, index) => (
                      <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                          src={`data:image/jpeg;base64,${image.imageData}`}
                          className="d-block w-100"
                          alt={`Slide ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="col-md-6">
                {/* Color selection */}
                <div className="row list_item rounded-3 lh-lg border-bottom-0 border border-gray text-start">
                  <div className="col-md-6 border-end border-gray py-1 font-light-color">Choose Color</div>
                  <div className="col-md-6 py-1">
                    <div className="form-group">
                      <select className="form-control" id="colorSelect">
                        {product.colors && product.colors.map((color, index) => (
                          <option key={index}>{color}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row list_item rounded-3 lh-lg border-bottom-0 border border-gray text-start">
                  <div className="col-md-6 border-end border-gray py-1 font-light-color">Rate</div>
                  <div className="col-md-6 py-1 text-end">₹{product.rate}</div>
                </div>

                <div className="row list_item rounded-3 lh-lg border-bottom-0 border border-gray text-start">
                  <div className="col-md-6 border-end border-gray py-1 font-light-color">Discount</div>
                  <div className="col-md-6 py-1 text-end">₹{product.discount}</div>
                </div>

                <div className="row list_item rounded-3 lh-lg border border-gray text-start">
                  <div className="col-md-6 border-end border-gray py-1 font-light-color">After Discount Price</div>
                  <div className="col-md-6 py-1 fw-bold text-end">₹{product.afterDiscountPrice}</div>
                </div>
              </div>
            </div>

            {/* Product Specifications Section */}
            <div className="specifications">
              <h5 className="fs-sm">Specifications</h5>
              <ul className="list-group">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="list-group-item">
                    <span className="w-50 d-inline-block">{spec.label}</span>{spec.value}
                  </li>
                ))}
              </ul>
              <ul className="list-group">
                <li className="list-group-item">
                  <span className="w-50 d-inline-block">Warranty</span>{product.warranty}
                </li>
              </ul>
            </div>

            <br />
            <div className="warranty">
              <h5 className="fs-sm">Warranty</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <span className="w-50 d-inline-block">Warranty</span>{product.warranty}
                </li>
              </ul>
            </div>

            <br />
            <div className="additional_info">
              <h5 className="fs-sm">Additional Info</h5>
              <ul className="list-group">
                <li className="list-group-item">{product.additionalInfo}</li>
              </ul>
            </div>

            <div className="py-3 text-end">
            <Link to={`/product-edit/${product.id}`} className="btn btn-warning text-white mx-2" >
                Edit
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
