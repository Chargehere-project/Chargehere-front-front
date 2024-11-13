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
        <div className={styles.container}>
            <div className={styles.productSection}>
                <div className={styles.imageSection}>
                    <img 
                        src={product.Image} 
                        alt={product.ProductName} 
                        style={{ width: '100%', borderRadius: '8px' }} 
                    />
                </div>
                <div className={styles.infoSection}>
                    <h1 style={{ margin: '0px' }}>{product.ProductName}</h1>
                    <p style={{ margin: '0px' }}> {product.Price.toLocaleString()}원</p>
                    {product.Discount > 0 && (
                        <p style={{ margin: '0px' }}>
                            할인가: {(product.Price * (1 - product.Discount / 100)).toLocaleString()}원 ({product.Discount}% 할인)
                        </p>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '50px',
                            cursor: 'pointer',
                            borderTop: '1px solid #ddd',
                            paddingBottom: '20px',
                            paddingTop: '20px',
                        }}
                        onClick={toggleShippingDetails}>
                        <span style={{ fontSize: '16px' }}>무료 배송 및 반품</span>
                        {expandShipping ? (
                            <UpOutlined style={{ marginLeft: 'auto' }} />
                        ) : (
                            <DownOutlined style={{ marginLeft: 'auto' }} />
                        )}
                    </div>
                    {expandShipping && (
                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                            <p>
                                <strong>일반 배송</strong>
                            </p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>배송지역: 전국 (일부 지역 제외)</li>
                                <li>배송비: 무료배송</li>
                                <li>제품 수령일로부터 14일 이내에 무료 반품이 가능합니다.</li>
                            </ul>
                            <a href="#" style={{ color: '#000000', textDecoration: 'underline' }}>
                                일반 배송 자세히 알아보기
                            </a>
                            <br />
                            <a href="#" style={{ color: '#000000', textDecoration: 'underline' }}>
                                반품 자세히 알아보기
                            </a>
                            <p style={{ marginTop: '10px' }}>
                                <strong>A/S 안내</strong>
                            </p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>
                                    온라인에서 구매한 제품에 대한 A/S는 고객센터(080-012-3456)에서 유선으로만 접수
                                    가능합니다.
                                </li>
                            </ul>
                            <a href="#" style={{ color: '#000000', textDecoration: 'underline' }}>
                                자세히 알아보기
                            </a>
                        </div>
                    )}
                    <div className={styles.buttonGroup}>
                        <Button type="primary" onClick={buyNow} style={{ width: '150px', height: '45px' }}>
                            구매하기
                        </Button>
                        <Button onClick={addToCart} style={{ width: '150px', height: '45px' }}>
                            장바구니
                        </Button>
                    </div>
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
                                <List.Item.Meta
                                    title={
                                        <div>
                                            <span>평점: {review.Rating}</span>
                                            {review.User && (
                                                <span style={{ marginLeft: '10px' }}>{review.User.UserName}</span>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div>{review.Content}</div>
                                            <div style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>
                                                {new Date(review.ReviewDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane>
    
                <Tabs.TabPane tab={`상품 Q&A (${qas.length})`} key="3">
                    <List
                        dataSource={qas}
                        renderItem={(qa) => (
                            <List.Item key={qa.QID}>
                                <List.Item.Meta
                                    title={`Q. ${qa.Question}`}
                                    description={qa.Answer ? `A. ${qa.Answer}` : '답변 대기 중'}
                                />
                                <div>{qa.Date}</div>
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
