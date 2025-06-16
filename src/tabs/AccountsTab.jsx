import React from 'react';
import KpiCard from '../components/KpiCard';
import { Row, Col } from 'react-bootstrap';

const AccountsTab = ({ totalAssets, totalLiabilities, netWorth, formatCurrency }) => (
    <div className="space-y-6">
        <h2 className="text-center h2">Your Financial Position</h2>
        <Row className="g-4">
            <Col md={4}><KpiCard title="Total Assets" value={formatCurrency(totalAssets)} color="text-success" /></Col>
            <Col md={4}><KpiCard title="Total Liabilities" value={formatCurrency(totalLiabilities)} color="text-danger" /></Col>
            <Col md={4}><KpiCard title="Net Worth" value={formatCurrency(netWorth)} color={netWorth >= 0 ? "text-primary" : "text-warning"} /></Col>
        </Row>
        <p className="text-center text-muted small">
            Assets include the current value of your investments and saved goals. Liabilities are your open debts.
        </p>
    </div>
);
export default AccountsTab;
