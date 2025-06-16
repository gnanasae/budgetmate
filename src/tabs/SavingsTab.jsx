import React, { useState, useMemo } from 'react';
import { PiggyBank, Trash2, PlusCircle } from 'lucide-react';
import { Card, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';

const SavingsTab = ({ savingsGoals, onCreateGoal, onAddContribution, onDeleteGoal, formatCurrency }) => {
    const [name, setName] = useState(''); const [target, setTarget] = useState('');
    return (<div className="space-y-4"><Card><Card.Body><Form onSubmit={e => { e.preventDefault(); onCreateGoal({ name, targetAmount: parseFloat(target) }); setName(''); setTarget(''); }}><Row className="g-2 align-items-end"><Col md><Form.Control value={name} onChange={e=>setName(e.target.value)} placeholder="Goal (e.g., Vacation)" required /></Col><Col md><Form.Control type="number" value={target} onChange={e=>setTarget(e.target.value)} placeholder="Target (₹)" required /></Col><Col md="auto"><Button type="submit">Create Goal</Button></Col></Row></Form></Card.Body></Card><Row className="g-4">{savingsGoals.length > 0 ? savingsGoals.map(goal => <Col md={6} key={goal.id}><SavingsGoalCard goal={goal} onAddContribution={onAddContribution} onDeleteGoal={onDeleteGoal} formatCurrency={formatCurrency} /></Col>) : <p className="text-center text-muted py-5">No savings goals created.</p>}</Row></div>);
}
const SavingsGoalCard = ({ goal, onAddContribution, onDeleteGoal, formatCurrency }) => {
    const [amount, setAmount] = useState('');
    const contributed = useMemo(() => (goal.contributions || []).reduce((s,c)=>s+c.amount, 0), [goal.contributions]);
    const progress = goal.targetAmount > 0 ? (contributed / goal.targetAmount) * 100 : 0;
    return(<Card className="h-100 shadow-sm"><Card.Body className="d-flex flex-column"><div className="d-flex justify-content-between"><Card.Title as="h5" className="d-flex align-items-center"><PiggyBank size={20} className="me-2 text-info"/>{goal.name}</Card.Title><Button variant="light" size="sm" onClick={() => onDeleteGoal(goal.id)}><Trash2 size={16}/></Button></div><div className="my-3"><ProgressBar now={progress} variant="info" /><div className="d-flex justify-content-between small mt-1"><span>Saved: {formatCurrency(contributed)}</span><span>Target: {formatCurrency(goal.targetAmount)}</span></div></div><Form onSubmit={e=>{e.preventDefault(); onAddContribution(goal.id, parseFloat(amount)); setAmount('');}} className="d-flex gap-2 mt-auto"><Form.Control type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Contribute" size="sm" required/><Button type="submit" variant="info" size="sm">Add</Button></Form></Card.Body></Card>)
}
export default SavingsTab;