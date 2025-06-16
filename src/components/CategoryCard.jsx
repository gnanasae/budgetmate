import React from 'react';
import { Card } from 'react-bootstrap';

const CategoryCard = ({ title, icon: Icon, amount, color, formatCurrency }) => {
    return (
        <Card className={`category-card shadow-sm h-100 bg-${color} text-dark`}>
            <Card.Body className="d-flex flex-column justify-content-between p-3">
                <div>
                    <div className={`icon-wrapper mb-2 bg-${color}-light`}>
                        <Icon className={`text-${color}-dark`} size={24} />
                    </div>
                    <Card.Title as="h6" className="fw-bold mb-0">{title}</Card.Title>
                </div>
                <p className="h4 fw-bold mb-0 mt-2">{formatCurrency(amount)}</p>
            </Card.Body>
        </Card>
    );
};
export default CategoryCard;
