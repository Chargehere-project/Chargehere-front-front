import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, List, Tabs, Form, message } from 'antd';
import { jwtDecode } from 'jwt-decode';
import ProductQA from './ProductQA';
import {
    Container,
    ProductSection,
    ImageSection,
    InfoSection,
    ProductTitle,
    ProductPrice,
    ButtonGroup,
    BuyButton,
    CartButton,
    ShippingInfoContainer,
    ShippingInfoTitle,
    ShippingSectionTitle,
    ShippingText,
    TabsContainer,
} from './DetailStyles';

interface Product {
    ProductID: number;
    ProductName: string;
    Image: string;
    Price: number;
    Discount: number;
    Description: string;
}

interface Review {
    ReviewID: number;
    ProductID: number;
    UserID: number;
    Rating: number;
    Content: string;
    ReviewDate: string;
    User?: {
        UserName: string;
    };
}

interface QA {
    QID: number;
    ProductID: number;
    UserID: number;
    Question: string;
    Answer: string | null;
    Date: string;
}

const Detail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [qas, setQAs] = useState<QA[]>([]);
    const [qasCount, setQasCount] = useState<number>(0); // Q&A 개수를 저장할 상태
    const [expandShipping, setExpandShipping] = useState(false);
    const [isShippingInfoVisible, setIsShippingInfoVisible] = useState(false);
    const [newQuestion, setNewQuestion] = useState<string>('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!router.isReady || !id) return;
            try {
                const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`);
                setProduct(productResponse.data.data);

                const reviewResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}`);
                if (reviewResponse.data.result) {
                    setReviews(reviewResponse.data.data);
                }

                // Q&A 개수를 가져오는 요청
                const qaCountResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/qas/count?productId=${id}`);
                setQasCount(qaCountResponse.data.count); // 백엔드에서 'count' 필드로 개수를 반환한다고 가정

            } catch (error) {
                console.error('데이터를 불러오는데 실패했습니다.', error);
            }
        };

        fetchProduct();
    }, [router.isReady, id]);

    const addToCart = async () => {
        try {
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
                `${process.env.NEXT_PUBLIC_API_URL}/api/savecart`,
                {
                    userId,
                    productId: id,
                    quantity: 1,
                    price: product?.Price,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
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

    const buyNow = async () => {
        if (!product) {
            alert('상품 정보를 불러오는 중입니다.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            router.push('/mall/login');
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            const sessionResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/check-session`, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            if (!sessionResponse.data.result) {
                alert('세션 정보가 없습니다.');
                return;
            }

            const { phoneNumber, address } = sessionResponse.data.userDetails;
            const discountedPrice = product.Price * (1 - (product.Discount || 0) / 100);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/buy`,
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
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.data.result) {
                router.push(`/order/${response.data.data}`);
            }
        } catch (error) {
            console.error('구매 실패:', error);
            alert('구매 처리 중 오류가 발생했습니다.');
        }
    };

    const handleQuestionSubmit = () => {
        router.push(`/mall/product/${id}/qa/write`);
    };

    if (!product) {
        return <div>로딩중...</div>;
    }

    const shippingInfo = {
        delivery: '• 배송비는 전 상품 3000원이 부과됩니다.\n• 주문일로부터 1-3일 이내 출고됩니다.',
        returns:
            '• 상품 수령 후 7일 이내 반품 가능합니다.\n• 제품 하자 시 무료 반품 가능합니다.\n• 변심으로 인한 반품 시 배송비는 고객 부담입니다.',
    };

    return (
        <Container>
            <ProductSection>
                <ImageSection>
                    <img
                        src={product?.Image}
                        alt={product?.ProductName}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </ImageSection>
                <InfoSection>
                    <ProductTitle>{product?.ProductName}</ProductTitle>
                    <ProductPrice>{product?.Price.toLocaleString()}원</ProductPrice>
                    <ButtonGroup>
                        <BuyButton onClick={buyNow}>구매하기</BuyButton>
                        <CartButton onClick={addToCart}>장바구니</CartButton>
                    </ButtonGroup>
    
                    <ShippingInfoContainer>
                        <ShippingInfoTitle>배송 및 반품</ShippingInfoTitle>
                        <div>
                            <ShippingSectionTitle>배송 안내</ShippingSectionTitle>
                            {shippingInfo.delivery.split('\n').map((text, index) => (
                                <ShippingText key={index}>{text}</ShippingText>
                            ))}
                        </div>
                        <div>
                            <ShippingSectionTitle>반품 안내</ShippingSectionTitle>
                            {shippingInfo.returns.split('\n').map((text, index) => (
                                <ShippingText key={index}>{text}</ShippingText>
                            ))}
                        </div>
                    </ShippingInfoContainer>
                </InfoSection>
            </ProductSection>
    
            <Tabs defaultActiveKey="1" style={{ marginTop: '40px' }}>
                <Tabs.TabPane tab="상세정보" key="1">
                    <p>{product.Description}</p>
                </Tabs.TabPane>
                <Tabs.TabPane tab={`사용후기 (${reviews.length})`} key="2">
                    <List
                        dataSource={reviews}
                        renderItem={(review) => (
                            <List.Item key={review.ReviewID}>
                                <List.Item.Meta title={`평점: ${review.Rating}`} description={review.Content} />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab={`상품 Q&A (${qasCount})`} key="3">
                    <ProductQA productId={Number(id)} />
                </Tabs.TabPane>
            </Tabs>
        </Container>
    );
};

export default Detail;
