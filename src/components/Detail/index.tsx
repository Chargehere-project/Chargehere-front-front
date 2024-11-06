import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from 'antd'; // Ant Design 버튼 사용
import { jwtDecode } from 'jwt-decode';

interface Product {
    ProductName: string;
    Image: string;
    Price: number;
    Discount: number;
    Description: string;
}

const Detail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!router.isReady) return;
                if (!id) return;

                const response = await axios.get(`http://localhost:8000/product/${id}`);
                console.log('제품 데이터:', response.data);
                setProduct(response.data.data);
            } catch (error) {
                console.error('제품 상세정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchProduct();
    }, [router.isReady, id]);

    // 장바구니 추가 함수
    const addToCart = async () => {
        try {
            // token 함수를 분리하고 직접 토큰 값을 가져오기
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                alert('로그인이 필요합니다.');
                return;
            }
    
            let userId;
            try {
                const decoded: any = jwtDecode(authToken);
                userId = decoded.UserID;
            } catch (error) {
                console.error('토큰 디코드 에러:', error);
                return;
            }
    
            const response = await axios.post(
                'http://localhost:8000/savecart',
                {
                    userId,
                    productId: id,
                    quantity: 1,
                    price: product?.Price  // 숫자 형태로 전송
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.data.result) {
                alert('장바구니에 추가되었습니다.');
            }
        } catch (error) {
            console.error('장바구니 추가 실패:', error);
            alert('장바구니 추가에 실패했습니다.');
        }
    };

    // 구매하기 함수
    const buyNow = async () => {
        try {
            // product가 null인지 먼저 확인
            if (!product) {
                alert('상품 정보를 불러오는 중입니다.');
                return;
            }

            // 1. JWT 토큰 확인 및 디코딩
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            // 2. JWT 토큰에서 유저 정보 추출
            const decoded: any = jwtDecode(token);

            // 3. 세션에서 유저 상세 정보 가져오기
            const sessionResponse = await axios.get('http://localhost:8000/check-session', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!sessionResponse.data.result) {
                alert('세션 정보가 없습니다.');
                return;
            }

            const { phoneNumber, address } = sessionResponse.data.userDetails;

            // 4. 할인가 계산
            const discountedPrice = product.Price * (1 - (product.Discount || 0) / 100);

            // 5. 구매 요청 보내기
            const response = await axios.post(
                'http://localhost:8000/buy',
                {
                    UserID: decoded.UserID,
                    ProductID: id,
                    Amount: discountedPrice,
                    CustomerName: decoded.UserName,
                    CustomerPhoneNumber: phoneNumber,
                    CustomerAddress: address,
                    Quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.result) {
                console.log(response.data.data, '주문아이디');
                alert('주문이 완료되었습니다.');
                router.push(`/order/${response.data.data}`);
            }
        } catch (error) {
            console.error('구매 실패:', error);
            alert('구매 처리 중 오류가 발생했습니다.');
        }
    };

    if (!product) {
        return <div>로딩중...</div>;
    }

    return (
        <div
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '40px',
                }}
            >
                {/* 제품 이미지 */}
                <div style={{ flex: '1' }}>
                    <img
                        src={product.Image}
                        alt={product.ProductName}
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                        }}
                    />
                </div>

                {/* 제품 정보 */}
                <div style={{ flex: '1' }}>
                    <h1>{product.ProductName}</h1>
                    <div style={{ marginTop: '20px' }}>
                        <p>가격: {product.Price.toLocaleString()}원</p>
                        {product.Discount > 0 && (
                            <p>
                                할인가: {(product.Price * (1 - product.Discount / 100)).toLocaleString()}원 (
                                {product.Discount}% 할인)
                            </p>
                        )}
                    </div>

                    {/* 버튼 그룹 */}
                    <div
                        style={{
                            marginTop: '30px',
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={buyNow}
                            style={{
                                width: '150px',
                                height: '45px',
                            }}
                        >
                            구매하기
                        </Button>
                        <Button
                            onClick={addToCart}
                            style={{
                                width: '150px',
                                height: '45px',
                            }}
                        >
                            장바구니
                        </Button>
                    </div>
                </div>
            </div>
            <p>상세 설명: {product.Description}</p>
        </div>
    );
};

export default Detail;
