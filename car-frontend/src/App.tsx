
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp'
import ProductListPage from './pages/ProductListPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductDetailPage from './pages/ProductDetailPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/create" element={<ProductCreatePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
