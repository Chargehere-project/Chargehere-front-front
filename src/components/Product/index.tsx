import React, { useState } from 'react';
import ProductItem from './ProductItem';
import { Input } from 'antd';

interface ProductData {
    id: number;
    image: string;
    name: string;
    discount: number;
    price: number;
    details: string;
}

const Product: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 20; // 한 페이지에 보여줄 아이템 수

    // 더미 데이터 (총 30개)
    const products: ProductData[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        image: `/images/product${(i % 10) + 1}.jpg`, // 이미지 경로
        name: `Product ${i + 1}`,
        discount: (i % 10) * 5,
        price: (i + 1) * 10,
        details: `Details about product ${i + 1}`,
    }));

    // 검색 필터링 로직
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        setCurrentPage(1); // 검색 시 항상 첫 페이지로 돌아감
    };

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
                    gridTemplateColumns: 'repeat(5, 1fr)', // 가로 5개
                    gridTemplateRows: 'repeat(4, auto)', // 세로 4개
                    gap: '16px',
                    justifyContent: 'center',
                }}
            >
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <ProductItem
                            key={product.id}
                            id={product.id} // id 추가
                            image={product.image}
                            name={product.name}
                            discount={product.discount}
                            price={product.price}
                            details={product.details}
                        />
                    ))
                ) : (
                    <p style={{ gridColumn: 'span 5', textAlign: 'center' }}>검색 결과가 없습니다.</p>
                )}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {/* 페이지네이션 버튼 */}
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
