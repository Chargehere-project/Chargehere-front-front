import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Input, List, Tabs, Form, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {jwtDecode} from 'jwt-decode';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Detail.module.css';


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
        // 유저 정보 추가 (필요한 경우)
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
    const { id } = router.query; // 상품 ID
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [qas, setQAs] = useState<QA[]>([]);
    const [newQuestion, setNewQuestion] = useState<string>('');

    const [expandShipping, setExpandShipping] = useState(false);
    const [isShippingInfoVisible, setIsShippingInfoVisible] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!router.isReady || !id) return;
            try {
                const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`);
                setProduct(productResponse.data.data);

                // 해당 상품에 대한 리뷰 가져오기 (URL 수정)
                const reviewResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}`);
                if (reviewResponse.data.result) {
                    setReviews(reviewResponse.data.data);
                }

                // 해당 상품에 대한 Q&A 가져오기

                const qaResponse = await axios.get(`/api/qas?productId=${id}`);
                setQAs(qaResponse.data);
            } catch (error) {
                console.error('데이터를 불러오는데 실패했습니다.', error);
            }
        };

        fetchProduct();
    }, [router.isReady, id]);

    const addToCart = async () => {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            alert('로그인이 필요합니다.');
            router.push('/mall/login'); // 로그인 페이지로 리다이렉트
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

        try {
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
        router.push(`/CS/Detail/Qawrite?id=${id}`);
    };

    const toggleShippingDetails = () => {
        setExpandShipping(!expandShipping);
    };

    if (!product) {
        return <div>로딩중...</div>;
    }
    const shippingInfo = {
        delivery: '• 배송비는 전 상품 3000원이 부과됩니다.\n• 주문일로부터 1-3일 이내 출고됩니다.',
        returns:
            '• 상품 수령 후 7일 이내 반품 가능합니다.\n• 제품 하자 시 무료 반품 가능합니다.\n• 변심으로 인한 반품 시 배송비는 고객 부담입니다.',
    };

    if (!product) {
        return <div>로딩중...</div>;
    }

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', marginTop: '100px' }}>
            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: '1' }}>
                    <img src={product.Image} alt={product.ProductName} style={{ width: '100%', borderRadius: '8px' }} />
                </div>
                <div style={{ flex: '1', marginLeft: '50px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>{product.ProductName}</h1>
                    <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{product.Price.toLocaleString()}원</p>
                    {product.Discount > 0 && (
                        <p style={{ fontSize: '18px', color: '#888' }}>
                            할인가: {(product.Price * (1 - product.Discount / 100)).toLocaleString()}원 (
                            {product.Discount}% 할인)
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <Button type="primary" onClick={buyNow}>
                            구매하기
                        </Button>
                        <Button onClick={addToCart}>장바구니</Button>
                    </div>

                    <div
                        style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer' }}
                        onClick={() => setIsShippingInfoVisible(!isShippingInfoVisible)}>
                        <span>무료 배송 및 반품</span>
                        {isShippingInfoVisible ? <UpOutlined /> : <DownOutlined />}
                    </div>

                    {isShippingInfoVisible && (
                        <div style={{ marginTop: '10px' }}>
                            <p>
                                <strong>배송 안내</strong>
                            </p>
                            <p>{shippingInfo.delivery}</p>
                            <p>
                                <strong>반품 안내</strong>
                            </p>
                            <p>{shippingInfo.returns}</p>
                        </div>
                    )}
                </div>
            </div>

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
                <Tabs.TabPane tab={`상품 Q&A (${qas.length})`} key="3">
                    <List
                        dataSource={qas}
                        renderItem={(qa) => (
                            <List.Item key={qa.QID}>
                                <List.Item.Meta title={`Q. ${qa.Question}`} description={qa.Answer || '답변 대기 중'} />
                            </List.Item>
                        )}
                    />
                    <Form layout="inline" style={{ marginTop: '20px' }}>
                        <Form.Item>
                            <Button type="primary" onClick={handleQuestionSubmit}>
                                질문하기
                            </Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Detail;
