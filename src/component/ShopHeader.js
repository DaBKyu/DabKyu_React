import React, { useState, useEffect } from 'react';
import '../css/shopHeader.css';

const ShopHeader = () => {
    const [categories, setCategories] = useState({
        mist: [],
        list2: [],
        list3: [],
      });

    const [keyword, setKeyword] = useState('');
    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await fetch('http://localhost:8082/shop/main');
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setCategories({
              mist: data.mist || [],
              list2: data.list2 || [],
              list3: data.list3 || [],
            });
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };

        const checkSession = async () => {
            try {
              // Replace with actual session-checking API call
              const response = await fetch('http://localhost:8082/session', {
                credentials: 'include', // To include cookies in the request
              });
      
              if (!response.ok) {
                throw new Error('Failed to fetch session info');
              }
      
              const data = await response.json();
              setIsLoggedIn(data.isLoggedIn); // Assuming API returns { isLoggedIn: true/false }
            } catch (error) {
              console.error('Error fetching session info:', error);
              setIsLoggedIn(false);
            }
        };


        checkSession();
        fetchCategories();
    }, []);




    const handleSearch = () => {
        if (keyword.trim()) {
            window.location.href = `/shop/searchAll?page=1&keyword=${keyword}`;
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleAside = () => {
        setIsAsideOpen((prevState) => !prevState);
    };

    return (
        <div>
        <nav>
            <div style={{display: 'flex', alignItems: 'center', width: '100%', position: 'relative'}}>
            {/* Menu toggle icon */}
            <i className="fi fi-br-menu-burger" id="menu-toggle" style={{fontSize: '25px', marginTop: '1.5px', marginLeft: '20px'}} onClick={toggleAside}></i>
            <a style={{marginLeft: '50px', fontSize: '45px', textDecoration: 'none', color: '#31b8da', fontWeight: 'bold'}} href="/shop/main">DABKYU</a>
            {/* Search bar */}
            <div style={{flexGrow: 1, position: 'relative', maxWidth: '700px', marginLeft: '140px'}}>
                <input type="text" name="keyword" id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKeyDown} 
                    placeholder="상품을 검색해보세요!"
                    style={{width: '700px',height: '35px',border: '2px solid #b0ece9',fontSize: '16px',borderRadius: '20px',paddingLeft: '10px',outline: 'none'}}/>
                <i className="fi fi-br-search"onClick={handleSearch}
                    style={{position: 'absolute',right: '15px',top: '50%',transform: 'translateY(-50%)',height: '17px',cursor: 'pointer'}}></i>
            </div>
            {/* Icons */}
            <div style={{display: 'flex',gap: '30px',alignItems: 'center',marginLeft: 'auto',marginRight: '10px',position: 'relative',textAlign: 'center'}}>
                {isLoggedIn ? (<a href="/member/logout" 
                                    style={{ textDecoration: 'none', color: 'inherit' }}>로그아웃</a>) : (<a href="/member/login" style={{ textDecoration: 'none', color: 'inherit' }}>로그인</a>)}
                <a href="/mypage/memberInfo" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fi fi-rr-user" style={{ fontSize: '32px', cursor: 'pointer' }}></i>
                <br />
                <span style={{fontSize: '14px', color: '#333'}}>마이페이지</span>
                </a>
                <a href="/mypage/shoppingCart" style={{ textDecoration: 'none', color: 'inherit' }}>
                <i className="fi fi-rr-shopping-cart" style={{ fontSize: '32px', cursor: 'pointer' }}></i>
                <br />
                <span style={{fontSize: '14px', color: '#333'}}>장바구니</span>
                </a>
                <a style={{textDecoration: 'none', color: 'inherit'}}>
                <i className="fi fi-rs-bell" id="notificationBtn" style={{fontSize: '32px', cursor: 'pointer'}}></i>
                <br />
                <span style={{fontSize: '14px', color: '#333'}}>알림</span>
                </a>
            </div>
            </div>
        </nav>
        <aside className={isAsideOpen ? 'open' : ''}>
            <ul>
            {categories.mist.map((item) => (
                <li key={item.category1Seqno} className="dropdown">
                <a>
                    <span style={{ fontSize: '17px' }}>{item.category1Name}</span>
                </a>
                <ul>
                    {categories.list2
                    .filter((item2) => item2.category1Seqno.category1Seqno === item.category1Seqno)
                    .map((item2) => (
                        <li key={item2.category2Seqno} className="dropdown_two">
                        <a><span style={{ fontSize: '12px' }}>{item2.category2Name}</span></a>
                        <ul>
                            {categories.list3
                            .filter((item3) => item3.category2Seqno.category2Seqno === item2.category2Seqno)
                            .map((item3) => (
                                <li key={item3.category3Seqno}>
                                <a href={`/shop/categoryProduct?cate=${item3.category3Seqno}&page=1`} style={{textDecoration: 'none', color: 'inherit'}}>
                                    <span style={{fontSize: '12px'}}>{item3.category3Name}</span>
                                </a>
                                </li>
                            ))}
                        </ul>
                        </li>
                    ))}
                </ul>
                </li>
            ))}
            </ul>
        </aside>
        </div>
    );
};

export default ShopHeader;
