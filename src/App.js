import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/shopHeader.css"; 
import "./css/AdminSidebar.css"; 
import AdminMain from './component/Admin/AdminMain.js';
import ProductList from './component/Admin/ProductList.js';
import ProductDetail from './component/Admin/ProductDetail.js';
import PostProduct from './component/Admin/PostProduct.js';
import CategoryList from './component/Admin/CategoryList.js';
import CouponList from './component/Admin/CouponList.js';
import CouponDetail from './component/Admin/CouponDetail.js';
import CreateCoupon from './component/Admin/CreateCoupon.js';
import CouponDistribution from './component/Admin/CouponDistribution.js';
import MemberList from './component/Admin/MemberList.js';
import UpdateCoupon from './component/Admin/UpdateCoupon.js';
import MemberDetail from './component/Admin/MemberDetail.js';
import UpdateProduct from './component/Admin/UpdateProduct.js';
import OrderList from './component/Admin/OrderList.js';
import OrderDetail from './component/Admin/OrderDetail.js';
import QuestionList from './component/Admin/QuestionList.js';
import QuestionDetail from './component/Admin/QuestionDetail.js';
import ReviewList from './component/Admin/ReviewList.js';
import ReviewDetail from './component/Admin/ReviewDetail.js';
import ReportList from './component/Admin/ReportList.js';
import ReportDetail from './component/Admin/ReportDetail.js';
import MailList from './component/Admin/MailList.js';
const App = () => {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/master/main" element={<AdminMain />} />
        <Route path="/master/productList" element={<ProductList />} />
        <Route path="/master/productDetail/:productSeqno" element={<ProductDetail />} />
        <Route path="/master/postProduct" element={<PostProduct />} />
        <Route path="/master/updateProduct/:productSeqno" element={<UpdateProduct />} />
        <Route path="/master/categoryList" element={<CategoryList />} />
        <Route path="/master/couponList" element={<CouponList />} />
        <Route path="/master/couponDetail/:couponSeqno" element={<CouponDetail />} />
        <Route path="/master/createCoupon" element={<CreateCoupon />} />
        <Route path="/master/couponDistribution" element={<CouponDistribution />} />
        <Route path="/master/updateCoupon/:couponSeqno" element={<UpdateCoupon />} />
        <Route path="/master/memberList" element={<MemberList />} />
        <Route path="/master/memberDetail/:email" element={<MemberDetail />} />
        <Route path="/master/orderList" element={<OrderList />} />
        <Route path="/master/orderDetail/:orderSeqno" element={<OrderDetail />} />
        <Route path="/master/questionList" element={<QuestionList />} />
        <Route path="/master/questionDetail/:queSeqno" element={<QuestionDetail />} />
        <Route path="/master/reviewList" element={<ReviewList />} />
        <Route path="/master/reviewDetail/:reviewSeqno" element={<ReviewDetail />} />
        <Route path="/master/reportList" element={<ReportList />} />
        <Route path="/master/reportDetail/:reportSeqno" element={<ReportDetail />} />
        <Route path="/master/mailList" element={<MailList />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
