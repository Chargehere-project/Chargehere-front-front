import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import SortDropdown from './SortDropdown';
import { Input, Select } from 'antd';
import axios from 'axios';
import { 
    ProductGrid, 
    SearchContainer, 
    SearchIconButton, 
    SearchInput, 
    TopContainer,
    ProductTitle
} from '../../styles/Product.styles';
import { SearchIcon } from 'lucide-react';

interface ProductData {
    ProductID: number;
    Image: string; // 백엔드 컬럼명에 맞게 수정
    ProductName: string; // 백엔드 컬럼명에 맞게 수정
    Discount: number; // 백엔드 컬럼명에 맞게 수정
    Price: number; // 백엔드 컬럼명에 맞게 수정
}
const { Option } = Select;

const Product = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState<string>('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const itemsPerPage = 20;

    // 데이터 가져오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                setProducts(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('제품 데이터를 가져오는데 실패했습니다:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    // 페이지 변경 함수
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getSortedProducts = (products: ProductData[]) => {
        // sortType이 빈 문자열일 때도 기본 정렬 처리
        if (!sortType) {
            return products;
        }

        switch (sortType) {
            case 'latest':
                return [...products].sort((a, b) => b.ProductID - a.ProductID);
            case 'priceLow':
                return [...products].sort((a, b) => a.Price - b.Price);
            case 'priceHigh':
                return [...products].sort((a, b) => b.Price - a.Price);
            case 'discountHigh':
                return [...products].sort((a, b) => b.Discount - a.Discount);
            default:
                return products;
        }
    };

    // 검색 및 정렬된 상품 목록
    const filteredAndSortedProducts = getSortedProducts(
        products.filter((product) => product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 현재 페이지에 보여줄 데이터 slice를 filteredAndSortedProducts를 사용하도록 수정
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    // totalPages도 filteredAndSortedProducts를 사용하도록 수정
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        setSortType(value);
        setCurrentPage(1);
    };

    if (loading) {
        return <div>로딩중...</div>;
    }

    return (
        <div>
            <ProductTitle>PRODUCT</ProductTitle>
            <TopContainer
            >
                <SearchContainer>
                    <SearchInput
                        type="search"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        isVisible={isSearchVisible}
                    />
                    <SearchIconButton onClick={() => setIsSearchVisible(!isSearchVisible)}>
                        <SearchIcon size={20} />
                    </SearchIconButton>
                </SearchContainer>
                <SortDropdown
                    value={sortType}
                    onChange={(value) => {
                        setSortType(value);
                        setCurrentPage(1);
                    }}
                />
            </TopContainer>
            <ProductGrid>
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <ProductItem
                            key={product.ProductID}
                            ProductID={product.ProductID}
                            Image={product.Image}
                            ProductName={product.ProductName}
                            Discount={product.Discount}
                            Price={product.Price}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 4', textAlign: 'center' }}>검색 결과가 없습니다.</div>
                )}
            </ProductGrid>

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
