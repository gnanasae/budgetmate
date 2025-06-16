import React from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthSelector = ({ selectedMonth, changeMonth }) => { 
    const d = new Date(`${selectedMonth}-02`); 
    return (
        <Card className="my-4 shadow-sm border-0">
            <Card.Body>
                <Row className="justify-content-center align-items-center">
                    <Col xs="auto">
                        <Button variant="light" onClick={() => changeMonth(-1)}><ChevronLeft /></Button>
                    </Col>
                    <Col xs="auto">
                        <h2 className="h4 mb-0">{d.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    </Col>
                    <Col xs="auto">
                        <Button variant="light" onClick={() => changeMonth(1)}><ChevronRight /></Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    ); 
};
export default MonthSelector;
