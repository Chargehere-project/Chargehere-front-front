import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Input, List, Tabs, Form, message } from 'antd';
import {jwtDecode} from 'jwt-decode';

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

    useEffect(() => {
        const fetchProduct = async () => {
            if (!router.isReady || !id) return;
            try {
                // 상품 정보 가져오기
                const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`);
                setProduct(productResponse.data.data);

                // 해당 상품에 대한 리뷰 가져오기
                const reviewResponse = await axios.get(`/api/reviews?productId=${id}`);
                setReviews(reviewResponse.data);

                // 해당 상품에 대한 Q&A 가져오기
                const qaResponse = await axios.get(`/api/qas?productId=${id}`);
                setQAs(qaResponse.data);
            } catch (error) {
                console.error('데이터를 불러오는데 실패했습니다.', error);
            }
        };

        fetchProduct();
    }, [router.isReady, id]);

    // 장바구니 추가 함수
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
                    price: product?.Price
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
        if (!product) {
            alert('상품 정보를 불러오는 중입니다.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            router.push('/login');
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
                console.log(response.data.data, '주문아이디');

                router.push(`/order/${response.data.data}`);
            }
        } catch (error) {
            console.error('구매 실패:', error);
            alert('구매 처리 중 오류가 발생했습니다.');
        }
    };

    // Q&A 질문 등록 함수
    const handleQuestionSubmit = async () => {
        if (!newQuestion) {
            alert('질문 내용을 입력해주세요.');
            return;
        }
        try {
            const response = await axios.post('/api/qas', {
                productId: id,
                question: newQuestion,
                userId: 1,
            });
            setQAs([...qas, response.data]);
            setNewQuestion('');
        } catch (error) {
            console.error('질문 등록 실패:', error);
        }
    };

    if (!product) {
        return <div>로딩중...</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1>{product.ProductName}</h1>
            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: '1' }}>
                    <img src={product.Image} alt={product.ProductName} style={{ width: '100%', borderRadius: '8px' }} />
                </div>
                <div style={{ flex: '1' }}>
                    <h1>{product.ProductName}</h1>
                    <p>가격: {product.Price.toLocaleString()}원</p>
                    {product.Discount > 0 && (
                        <p>할인가: {(product.Price * (1 - product.Discount / 100)).toLocaleString()}원 ({product.Discount}% 할인)</p>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <Button type="primary" onClick={buyNow} style={{ width: '150px', height: '45px' }}>구매하기</Button>
                        <Button onClick={addToCart} style={{ width: '150px', height: '45px' }}>장바구니</Button>
                    </div>
                </div>
            </div>

            <Tabs defaultActiveKey="1" style={{ marginTop: '40px' }}>
                <Tabs.TabPane tab="상세정보" key="1">
                    <p>{product.Description}</p>
                </Tabs.TabPane>
                
                <Tabs.TabPane tab={`사용후기 (${reviews.length})`} key="2">
                    <List dataSource={reviews} renderItem={(review) => (
                        <List.Item key={review.ReviewID}>
                            <List.Item.Meta title={`평점: ${review.Rating}`} description={review.Content} />
                            <div>{review.ReviewDate}</div>
                        </List.Item>
                    )} />
                </Tabs.TabPane>

                <Tabs.TabPane tab={`상품 Q&A (${qas.length})`} key="3">
                    <List dataSource={qas} renderItem={(qa) => (
                        <List.Item key={qa.QID}>
                            <List.Item.Meta title={`Q. ${qa.Question}`} description={qa.Answer ? `A. ${qa.Answer}` : '답변 대기 중'} />
                            <div>{qa.Date}</div>
                        </List.Item>
                    )} />
                    <Form layout="inline" style={{ marginTop: '20px' }}>
                        <Form.Item>
                            <Input placeholder="질문을 입력하세요" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleQuestionSubmit}>질문하기</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Detail;
