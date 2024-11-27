import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Correct icon import


const ProductView = () => {
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [category, setCategory] = useState("");
  const [catalogue, setCatalogue] = useState("");

  // Fetch all products when the component mounts
  useEffect(() => {
    axios.get('https://handymanapiservices.azurewebsites.net/api/Product')
      .then(response => {
        setProductData(response.data);
      })
      .catch(error => {
        console.error("Error fetching product data:", error);
      });
  }, []); // Empty dependency array ensures fetch happens once when component mounts

  // Handle delete functionality
  const handleDelete = (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      axios.delete(`https://handymanapiservices.azurewebsites.net/api/Product/${productId}`)
        .then(response => {
          setProductData(prevData => prevData.filter(product => product.id !== productId));
        })
        .catch(error => {
          console.error("Error deleting product:", error);
        });
    }
  };

  if (productData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">All Products</h2>
      <div className="d-flex align-items-center justify-content-between">
          {/* Category */}
          <div className="form-group text-start col-md-2 ml-2 m-5 mb-2">
            <label>Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Electrical items</option>
              <option>Plumbing Materials</option>
              <option>Sanitary items</option>
              <option>Electronics appliances</option>
              <option>Paints</option>
              <option>Hardware items</option>
              <option>Civil & Waterproofing Materials</option>
            </select>
          </div>

          {/* Catalogue */}
          <div className="form-group col-md-2 m-5 mb-2">
            <label>Catalogue</label>
            <select
              className="form-control"
              value={catalogue}
              onChange={(e) => setCatalogue(e.target.value)}
            >
              <option>Electrical</option>
              <option>Paints</option>
              <option>Hardware items</option>
            </select>
          </div>

          {/* Add New Product Button */}
          <div className="text-end col-md-3 mb-1">
            <button
              className="btn btn-success"
              onClick={() => navigate('/product')}
            >
              Add New Product
            </button>
          </div>
        </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>After Discount Price</th>
            <th>Actions</th> {/* Actions column for Edit/Delete/Preview */}
          </tr>
        </thead>
        <tbody>
          {productData.map((product, index) => (
            <tr key={index}>
              <td>{product.productName}</td>
              <td>₹{product.rate}</td>
              <td>{product.discount ? `${product.discount}%` : "No discount"}</td>
              <td>₹{product.afterDiscountPrice || 'N/A'}</td>
              <td>
                {/* Edit, Preview and Delete Icons */}
                <Link to={`/product-edit/${product.id}`} className="btn btn-warning mx-2" title="Edit" >
                  <FaEdit />
                </Link>
                <Link to={`/product-view/${product.id}`} className="btn btn-info mx-2" title="View">
                  <FaEye /> {/* Correct icon for Preview */}
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn btn-danger" title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductView;
