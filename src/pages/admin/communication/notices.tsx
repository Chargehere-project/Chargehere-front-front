import React from 'react';
import AdminLayout from '@/components/admin/layouts/AdminLayout'; // AdminLayout import
import NoticeManagement from '@/components/admin/Communication/NoticeManagement';

const ProductPage: React.FC = () => {
    return (
        <AdminLayout>
            <h1 style={{ marginBottom: '30px' }}>공지 관리</h1>
            <NoticeManagement/>
        </AdminLayout>
    );
};

export default ProductPage; // React 컴포넌트를 기본 내보내기 (default export)
