import React from 'react';
import AdminLayout from '@/components/admin/layouts/AdminLayout'; // AdminLayout import
import CouponTable from '@/components/admin/MarketingBenefits/CouponTable';

const PointsPage: React.FC = () => {
    return (
        <AdminLayout>
            <h1 style={{ marginBottom: '30px' }}>쿠폰 관리</h1>
            <CouponTable />
        </AdminLayout>
    );
};

export default PointsPage; // React 컴포넌트를 기본 내보내기 (default export)
