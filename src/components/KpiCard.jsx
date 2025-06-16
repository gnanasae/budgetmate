import React from 'react';
import { Card } from 'react-bootstrap';

const KpiCard = ({ title, value, color, icon: Icon }) => (
    <Card className="text-center shadow-sm h-100">
        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
            {Icon && <Icon className={`h-8 w-8 mb-2 ${color}`} />}
            <Card.Subtitle className="mb-2 text-muted">{title}</Card.Subtitle>
            <Card.Title as="h2" className={`mb-0 ${color || ''}`}>{value}</Card.Title>
        </Card.Body>
    </Card>
);
export default KpiCard;
