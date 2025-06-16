import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const DataForm = ({ type, onAddItem, editingItem, cancelEdit, categories, debts, savingsGoals }) => { 
    const [source, setSource] = useState(''); 
    const [amount, setAmount] = useState(''); 
    const [category, setCategory] = useState(categories[0] || ''); 
    
    useEffect(() => { 
        if (editingItem?.type === type) { 
            setSource(editingItem.source); 
            setAmount(editingItem.amount); 
            if(editingItem.category) setCategory(editingItem.category); 
        } else { 
            setSource(''); 
            setAmount(''); 
            setCategory(categories[0] || ''); 
        } 
    }, [editingItem, type, categories]); 
    
    const isSpecialCategory = category === 'Debt Payment' || category === 'Savings';

    useEffect(() => {
        if(isSpecialCategory && type === 'expense') setSource('');
    }, [category, isSpecialCategory, type]);

    const handleSubmit = (e) => { 
        e.preventDefault();
        if (!source || !amount || parseFloat(amount) <= 0) { alert("Please fill all fields correctly."); return; }
        onAddItem(type, { source, amount: parseFloat(amount), category: type !== 'income' ? category : undefined }); 
        setSource(''); 
        setAmount(''); 
    }; 
    
    return (
        <Card body className="bg-light">
            <h3 className="h5 mb-3">{editingItem ? `Edit` : `Add New`} {type}</h3>
            <Form onSubmit={handleSubmit}>
                <Row className="g-3 align-items-end">
                    <Col md>
                        <Form.Group>
                            <Form.Label className="visually-hidden">Source</Form.Label>
                            {type === 'expense' && isSpecialCategory ? (
                                <Form.Select value={source} onChange={e => setSource(e.target.value)} required>
                                    <option value="" disabled>Select a {category === 'Debt Payment' ? 'Debt' : 'Goal'}</option>
                                    {(category === 'Debt Payment' ? debts : savingsGoals).map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                                </Form.Select>
                            ) : (
                                <Form.Control value={source} onChange={e=>setSource(e.target.value)} placeholder="Source" required/>
                            )}
                        </Form.Group>
                    </Col>
                    {type!=='income'&& 
                        <Col md>
                            <Form.Group><Form.Label className="visually-hidden">Category</Form.Label><Form.Select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c} value={c}>{c}</option>)}</Form.Select></Form.Group>
                        </Col>
                    }
                    <Col md>
                         <Form.Group><Form.Label className="visually-hidden">Amount</Form.Label><Form.Control type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" required min="0.01" step="0.01" /></Form.Group>
                    </Col>
                    <Col md="auto">
                        <div className="d-flex gap-2">
                           <Button type="submit" variant="primary">{editingItem?'Update':'Add'}</Button>
                           {editingItem&&<Button type="button" variant="secondary" onClick={cancelEdit}>Cancel</Button>}
                        </div>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};
export default DataForm;
