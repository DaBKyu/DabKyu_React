import ShopFooter from "./ShopFooter";
import ShopHeader from "./ShopHeader";
import React, { useState, useEffect } from 'react';

const SearchAll = () => {
    const [products, setProducts] = useState([]);
    const [pageList, setPageList] = useState([]);

    useEffect(() => {
        // Fetch products and pagination data
        const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8082/shop/products'); // Replace with actual API endpoint
            const data = await response.json();

            setProducts(data.products); // Assuming response contains a `products` array
            setPageList(data.pageList); // Assuming response contains a `pageList` array
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        };

        fetchProducts();
    }, []);

    return (
        <div style={{paddingLeft:"200px", paddingRight:"180px", margin:"0"}}>
            <ShopHeader />
            모든 상품 검색
            <ShopFooter />
        </div>
    );
}

export default SearchAll;