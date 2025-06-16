import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, Landmark } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import { Card, Row, Col, Alert } from 'react-bootstrap';

const SummaryTab = ({ totalIncome, totalExpenses, balance, totalDebt, formatCurrency }) => { 
    const color = balance >= 0 ? 'success' : 'danger'; 
    return (
        <Card className="shadow">
            <Card.Body>
                <Card.Title as="h2" className="text-center mb-4">Monthly Summary</Card.Title>
                <Row className="g-4">
                    <Col md={6} lg={3}><KpiCard icon={TrendingUp} title="Income" value={formatCurrency(totalIncome)} color="text-success" /></Col>
                    <Col md={6} lg={3}><KpiCard icon={TrendingDown} title="Expenses" value={formatCurrency(totalExpenses)} color="text-danger" /></Col>
                    <Col md={6} lg={3}><KpiCard icon={IndianRupee} title="Balance" value={formatCurrency(balance)} color={`text-${color}`} /></Col>
                    <Col md={6} lg={3}><KpiCard icon={Landmark} title="Open Debt" value={formatCurrency(totalDebt)} color="text-warning" /></Col>
                </Row>
                <Alert variant={color} className="mt-4 text-center">
                    {balance < 0 ? "Expenses exceed income." : "Budget is balanced."}
                </Alert>
            </Card.Body>
        </Card>
    );
};
export default SummaryTab;
