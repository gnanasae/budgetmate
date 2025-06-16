import React, { useState, useMemo } from 'react';
import { Landmark, Trash2 } from 'lucide-react';
import { Card, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';

const DebtTab = ({ debts, onAddDebt, onDeleteDebt, onAddPayment, formatCurrency }) => {
    const [name, setName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    return (
        <div className="space-y-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={e => { e.preventDefault(); onAddDebt({ name, totalAmount: parseFloat(totalAmount) }); setName(''); setTotalAmount(''); }}>
                        <Row className="g-2 align-items-end">
                            <Col md><Form.Control value={name} onChange={e=>setName(e.target.value)} placeholder="Debt Name (e.g., Car Loan)" required /></Col>
                            <Col md><Form.Control type="number" value={totalAmount} onChange={e=>setTotalAmount(e.target.value)} placeholder="Total Amount (₹)" required /></Col>
                            <Col md="auto"><Button type="submit">Add Debt</Button></Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <Row className="g-4">
                {debts.length > 0 ? debts.map(debt => <Col md={6} key={debt.id}><DebtCard debt={debt} onDelete={onDeleteDebt} onAddPayment={onAddPayment} formatCurrency={formatCurrency} /></Col>) : <p className="text-center text-muted py-5">No debts tracked. Add one above.</p>}
            </Row>
        </div>
    );
};

const DebtCard = ({ debt, onDelete, onAddPayment, formatCurrency }) => {
    const [payment, setPayment] = useState('');
    const totalPaid = useMemo(() => (debt.payments || []).reduce((s,p)=>s+p.amount,0), [debt.payments]);
    const remaining = debt.totalAmount - totalPaid;
    const progress = debt.totalAmount > 0 ? (totalPaid / debt.totalAmount) * 100 : 0;
    return (
        <Card className="h-100 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <Card.Title as="h5" className="d-flex align-items-center mb-0"><Landmark size={20} className="me-2 text-danger"/>{debt.name}</Card.Title>
                    <Button variant="light" size="sm" onClick={() => onDelete(debt.id)}><Trash2 size={16}/></Button>
                </div>
                <div className="my-3">
                    <ProgressBar now={progress} variant="success" />
                    <div className="d-flex justify-content-between small mt-1">
                        <span>Paid: {formatCurrency(totalPaid)}</span>
                        <span>Remaining: {formatCurrency(remaining)}</span>
                    </div>
                </div>
                <Form onSubmit={e=>{e.preventDefault(); onAddPayment(debt.id, parseFloat(payment)); setPayment('');}} className="d-flex gap-2">
                    <Form.Control type="number" value={payment} onChange={e=>setPayment(e.target.value)} placeholder="Pay Amount" size="sm" required/>
                    <Button type="submit" variant="success" size="sm">Pay</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};
export default DebtTab;