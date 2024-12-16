import ShopFooter from "./ShopFooter";
import ShopHeader from "./ShopHeader";

const View = () => {

    return (
        <div style={{paddingRight: "180px", margin: "0"}}>
            <div style={{display: "flex"}}>
                <div style={{width: "200px", height: "1000px", backgroundColor: "white", boxSizing: "border-box", zIndex: "9999999999"}}></div>
                <div>
                    <ShopHeader />
                    상품 상세 페이지
                    <ShopFooter />
                </div>
            </div>
        </div>
    );
}

export default View;