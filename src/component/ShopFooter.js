import '../css/shopFooter.css';

const ShopFooter = () => {

    return (
        <div>
            <footer className="custom-footer" style={{position: "relative", width: "1525px", marginTop: "300px"}}>
                <div className="footer-container">
                    <div className="footer-links">
                        <a href='/'>회사소개</a>
                        <a href='/'>광고안내</a>
                        <a href='/'>서비스 이용약관</a>
                        <a href='/' className="privacy-policy">개인정보처리방침</a>
                        <a href='/'>청소년보호정책</a>
                        <a href='/'>고객센터</a>
                    </div>
                    <hr /> 
                    <div className="footer-info">
                        <p>© 2024 DABKYU. All rights reserved.</p>
                        <p>사업자등록번호: 123-45-67890 | 대표자: 다비켜 | 이메일: dabkyu@dabkyu.com</p>
                        <p>주소: 서울특별시 강서구 화곡로 179 대한상공회의소 서울기술교육센터 4층 | 고객센터: 1234-1234 (평일 09:00 ~ 18:00)</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default ShopFooter;