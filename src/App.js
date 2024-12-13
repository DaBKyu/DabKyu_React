import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminMain from './component/AdminMain.js';
import ProductList from './component/ProductList.js';
import ProductDetail from './component/ProductDetail.js';
import PostProduct from './component/PostProduct.js';
const App = () => {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/master/main" element={<AdminMain />} />
        <Route path="/master/productList" element={<ProductList />} />
        <Route path="/master/productDetail/:productSeqno" element={<ProductDetail />} />
        <Route path="/master/postProduct" element={<PostProduct />} />
         
      </Routes>
    </BrowserRouter>
  );
}



export default App;
