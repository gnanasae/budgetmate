import React, { useMemo } from 'react';
import DataForm from './DataForm';
import { Edit, Trash2 } from 'lucide-react';
import { Card, Table, Button } from 'react-bootstrap';

const DataTable = ({ title, data, type, onAddItem, onDeleteItem, onEditItem, formatCurrency, editingItem, categories, debts, savingsGoals }) => { 
    const total = useMemo(() => (data || []).reduce((s, i) => s + (i.amount || 0), 0), [data]); 
    const formatDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '') : 'N/A';
    
    return (
        <Card className="shadow">
            <Card.Body>
                <Card.Title as="h2" className="mb-4">{title}</Card.Title>
                <DataForm type={type} onAddItem={onAddItem} editingItem={editingItem} cancelEdit={()=>onEditItem(null, null)} categories={categories} debts={debts} savingsGoals={savingsGoals} />
                <div className="mt-4">
                    <Table striped bordered hover responsive>
                        <thead><tr><th>Source/Item</th>{type!=='income'&&<th>Category</th>}<th>Date</th><th className="text-end">Amount</th><th className="text-center">Actions</th></tr></thead>
                        <tbody>
                            {data && data.length > 0 ? data.map(i => (
                                <tr key={i.id}>
                                    <td>{i.source}</td>
                                    {type!=='income'&&<td>{i.category}</td>}
                                    <td>{formatDateTime(i.createdAt)}</td>
                                    <td className="text-end">{formatCurrency(i.amount)}</td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm" onClick={()=>onEditItem(type,i)} className="me-2"><Edit size={16}/></Button>
                                        <Button variant="outline-danger" size="sm" onClick={()=>onDeleteItem(type,i.id)}><Trash2 size={16}/></Button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5" className="text-center text-muted p-4">No {type} items yet.</td></tr>}
                        </tbody>
                        <tfoot><tr className="fw-bold"><td colSpan={type==='income'?2:3}>Total</td><td className="text-end">{formatCurrency(total)}</td><td></td></tr></tfoot>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};
export default DataTable;
