import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ShopHeader from './component/ShopHeader';
import Main from './component/Main';
import ShopFooter from './component/ShopFooter';
import View from './component/View';
import CategoryProduct from './component/CategoryProduct';
import SearchAll from './component/SearchAll';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/shop/shopheader" element={<ShopHeader />} />
        <Route path="/shop/shopfooter" element={<ShopFooter />} />
        <Route path="/shop/main" element={<Main />} />
        <Route path="/shop/searchAll" element={<SearchAll />} />
        <Route path="/shop/categoryProduct" element={<CategoryProduct />} />
        <Route path="/shop/view" element={<View />} />

      </Routes>
    </Router>
  );
}

export default App;
