import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Importing necessary components
import Header from './Header';
import Footer from './Footer';
import UploadForm from './uploadform';
import ProductView from './ProductView';  // Add ProductView component
import EditUploadForm from './EditUploadForm';
import ProductList from './ProductList';
import RaiseTicket from './RaiseTicket';
import BuyProduct from './BuyProducts';
import Sidebar from './Sidebar';
function App() {
  return (
    <Router>
      <div className="App">
        {/* Header Component */}
        <Header />

        {/* Main content */}
        <main className="container py-3 mt_100px">
          <Routes>
            <Route path="/product" element={<UploadForm />} />
            {/* Dynamic product ID route for ProductView */}
            <Route path="/product-view/:id" element={<ProductView />} /> 
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/product-edit/:id" element={<EditUploadForm />} />
            <Route path="/raiseTicket/:id" element={<RaiseTicket />} />
            <Route path="/buyProducts" element={<BuyProduct />} />
            <Route path="/sidebar" element={<Sidebar />} />
          </Routes>
        </main>

        {/* Footer Component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
