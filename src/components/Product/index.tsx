import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { Input } from 'antd';
import axios from 'axios';
import style from './profile.module.css';

interface ProductData {
    ProductID: number;
    Image: string;      // 백엔드 컬럼명에 맞게 수정
    ProductName: string;  // 백엔드 컬럼명에 맞게 수정
    Discount: number;    // 백엔드 컬럼명에 맞게 수정
    Price: number;      // 백엔드 컬럼명에 맞게 수정
}

const Product  = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 20;

    // 데이터 가져오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
                setProducts(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('제품 데이터를 가져오는데 실패했습니다:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    // 검색 필터링 로직
    const filteredProducts = products.filter((product) =>
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 현재 페이지에 보여줄 데이터 slice
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // 페이지 변경 함수
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // 검색어 업데이트 함수
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    if (loading) {
        return <div>로딩중...</div>;
    }

    return (
        <div>
            <Input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="검색어를 입력하세요"
                style={{
                    marginLeft: '600px',
                    marginTop: '20px',
                    marginBottom: '20px',
                    padding: '10px',
                    width: '100%',
                    maxWidth: '500px',
                    justifyContent: 'center',
                }}
            />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '16px',
                    justifyContent: 'center',
                }}
            >
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <ProductItem
                        key={product.ProductID}
                        ProductID={product.ProductID}    // id -> ProductID
                        Image={product.Image}           // image -> Image
                        ProductName={product.ProductName} // name -> ProductName
                        Discount={product.Discount}     // discount -> Discount
                        Price={product.Price}           // price -> Price
                    />
                    ))
                ) : (
                    <p style={{ gridColumn: 'span 5', textAlign: 'center' }}>검색 결과가 없습니다.</p>
                )}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            style={{
                                margin: '0 5px',
                                padding: '10px 15px',
                                cursor: 'pointer',
                                backgroundColor: currentPage === i + 1 ? '#333' : '#ccc',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default Product;