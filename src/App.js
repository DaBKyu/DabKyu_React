import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminMain from './component/AdminMain.js';
import ProductList from './component/ProductList.js';
import ProductDetail from './component/ProductDetail.js';
import PostProduct from './component/PostProduct.js';
import CategoryList from './component/CategoryList.js';
import CouponList from './component/CouponList.js';
import CouponDetail from './component/CouponDetail.js';
import CreateCoupon from './component/CreateCoupon.js';
import CouponDistribution from './component/CouponDistribution.js';
import MemberList from './component/MemberList.js';
const App = () => {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/master/main" element={<AdminMain />} />
        <Route path="/master/productList" element={<ProductList />} />
        <Route path="/master/productDetail/:productSeqno" element={<ProductDetail />} />
        <Route path="/master/postProduct" element={<PostProduct />} />
        <Route path="/master/categoryList" element={<CategoryList />} />
        <Route path="/master/couponList" element={<CouponList />} />
        <Route path="/master/couponDetail/:couponSeqno" element={<CouponDetail />} />
        <Route path="/master/createCoupon" element={<CreateCoupon />} />
        <Route path="/master/couponDistribution" element={<CouponDistribution />} />
        <Route path="/master/memberList" element={<MemberList />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
