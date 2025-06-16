import React, { useState, useEffect, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import DashboardTab from './tabs/DashboardTab';
import SummaryTab from './tabs/SummaryTab';
import AccountsTab from './tabs/AccountsTab';
import CalculatorTab from './tabs/CalculatorTab';
import InvestmentsTab from './tabs/InvestmentsTab';
import SavingsTab from './tabs/SavingsTab';
import DebtTab from './tabs/DebtTab';
import DataTable from './components/DataTable';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [searchQuery, setSearchQuery] = useState('');
    
    const [allData, setAllData] = useState(() => {
        try {
            const saved = localStorage.getItem('budgetData');
            const parsed = saved ? JSON.parse(saved) : {};
            if (!parsed.investments) parsed.investments = [];
            if (!parsed.savingsGoals) parsed.savingsGoals = [];
            if (!parsed.debts) parsed.debts = [];
            return parsed;
        } catch (error) { return { investments: [], savingsGoals: [], debts: [] }; }
    });

    const [editingItem, setEditingItem] = useState(null);

    const { incomes, expenses, debts, savingsGoals, investments } = useMemo(() => {
        const lq = searchQuery.toLowerCase();
        const filter = (items, keys) => {
            if (!searchQuery) return items || [];
            return (items || []).filter(item => 
                keys.some(key => (item[key] || '').toLowerCase().includes(lq))
            );
        };
        return {
            incomes: filter(allData[selectedMonth]?.incomes, ['source']),
            expenses: filter(allData[selectedMonth]?.expenses, ['source', 'category']),
            debts: filter(allData.debts, ['name']),
            savingsGoals: filter(allData.savingsGoals, ['name']),
            investments: filter(allData.investments, ['name', 'type'])
        };
    }, [allData, selectedMonth, searchQuery]);

    useEffect(() => { localStorage.setItem('budgetData', JSON.stringify(allData)); }, [allData]);
    useEffect(() => { 
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme); 
    }, [theme]);
  
    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    const changeMonth = (offset) => setSelectedMonth(prev => { const d = new Date(`${prev}-01T00:00:00Z`); d.setMonth(d.getMonth() + offset); return d.toISOString().slice(0, 7); });
    const cancelEdit = () => setEditingItem(null);
  
    const totalIncome = useMemo(() => (allData[selectedMonth]?.incomes || []).reduce((s, i) => s + parseFloat(i.amount || 0), 0), [allData, selectedMonth]);
    const totalExpenses = useMemo(() => (allData[selectedMonth]?.expenses || []).reduce((s, e) => s + parseFloat(e.amount || 0), 0), [allData, selectedMonth]);
    const totalOpenDebt = useMemo(() => (allData.debts || []).reduce((s, d) => s + (d.totalAmount - (d.payments || []).reduce((p,c)=>p+c.amount,0)), 0), [allData.debts]);
    const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
    const totalAssets = useMemo(() => {
        const investmentValue = (allData.investments || []).reduce((s,i) => s + i.currentValue, 0);
        const savingsValue = (allData.savingsGoals || []).reduce((s,g) => s + (g.contributions || []).reduce((cs, c) => cs + c.amount, 0), 0);
        return investmentValue + savingsValue;
    }, [allData.investments, allData.savingsGoals]);
    const netWorth = useMemo(() => totalAssets - totalOpenDebt, [totalAssets, totalOpenDebt]);

    const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);
  
    const handleAddItem = (type, item) => {
        if (editingItem && editingItem.type === type) { handleUpdateItem(type, { ...editingItem, ...item }); return; }
        const newItem = { id: Date.now(), ...item, createdAt: new Date().toISOString() };
        const dataKey = `${type}s`;
        setAllData(prev => {
            const monthData = prev[selectedMonth] || { incomes: [], expenses: [] };
            return { ...prev, [selectedMonth]: { ...monthData, [dataKey]: [...(monthData[dataKey] || []), newItem] }};
        });
    };

    const handleUpdateItem = (type, updatedItem) => {
        const dataKey = `${type}s`;
        setAllData(prev => {
            const monthData = prev[selectedMonth] || {};
            const items = monthData[dataKey] || [];
            const originalItem = items.find(i => i.id === updatedItem.id);
            const itemToUpdate = { ...updatedItem, createdAt: originalItem.createdAt };
            const updatedList = items.map(i => i.id === updatedItem.id ? itemToUpdate : i);
            return { ...prev, [selectedMonth]: { ...monthData, [dataKey]: updatedList } };
        });
        setEditingItem(null);
    };
  
    const handleDeleteItem = (type, id) => {
        if (window.confirm('Are you sure?')) {
            const dataKey = `${type}s`;
            setAllData(prev => {
                const monthData = prev[selectedMonth] || {};
                return { ...prev, [selectedMonth]: { ...monthData, [dataKey]: (monthData[dataKey] || []).filter(i => i.id !== id) } };
            });
        }
    };
  
    const handleEditItem = (type, item) => { setEditingItem({ ...item, type }); setActiveTab(`${type}s`); };

    const handleAddInvestment = (investment) => {
        const newInvestment = { id: `inv-${Date.now()}`, ...investment };
        const expense = { source: `Investment: ${investment.name}`, amount: investment.initialValue, category: 'Investment' };
        setAllData(prev => {
            const monthExpenses = prev[selectedMonth]?.expenses || [];
            return { ...prev, investments: [...(prev.investments || []), newInvestment], [selectedMonth]: { ...(prev[selectedMonth] || {}), expenses: [...monthExpenses, { id: `exp-${Date.now()}`, ...expense, createdAt: new Date().toISOString()}] }};
        });
    };
    const handleUpdateInvestment = (updated) => setAllData(prev => ({ ...prev, investments: (prev.investments || []).map(i => i.id === updated.id ? updated : i) }));
    const handleDeleteInvestment = (id) => { if(window.confirm('Delete investment? The initial expense entry will not be removed.')) { setAllData(prev => ({ ...prev, investments: (prev.investments || []).filter(i => i.id !== id) })); } };
  
    const handleAddDebt = (debt) => setAllData(prev => ({...prev, debts: [...(prev.debts || []), { id: `debt-${Date.now()}`, ...debt, payments: []}]}));
    const handleDeleteDebt = (id) => { if(window.confirm('Delete debt? Payments will not be removed from expenses.')) { setAllData(prev => ({...prev, debts: (prev.debts || []).filter(d => d.id !== id)}));}};
    const handleAddDebtPayment = (debtId, paymentAmount) => {
        const debt = allData.debts.find(d => d.id === debtId);
        if (!debt) return;
        const expense = { source: `Debt Payment: ${debt.name}`, amount: paymentAmount, category: 'Debt Payment' };
        setAllData(prev => ({...prev, debts: prev.debts.map(d => d.id === debtId ? {...d, payments: [...(d.payments || []), {id: `pay-${Date.now()}`, amount: paymentAmount, date: new Date().toISOString()}] } : d), [selectedMonth]: { ...(prev[selectedMonth] || {}), expenses: [...(prev[selectedMonth]?.expenses || []), {id: `exp-${Date.now()}`, ...expense, createdAt: new Date().toISOString()}] }}));
    };

    const handleCreateSavingsGoal = (goal) => setAllData(prev => ({...prev, savingsGoals: [...(prev.savingsGoals || []), { id: `sg-${Date.now()}`, ...goal, contributions: []}]}));
    const handleAddContribution = (goalId, amount) => {
        const goal = allData.savingsGoals.find(g => g.id === goalId);
        if (!goal) return;
        const expense = { source: `Savings: ${goal.name}`, amount, category: 'Savings' };
        setAllData(prev => ({...prev, savingsGoals: prev.savingsGoals.map(g => g.id === goalId ? {...g, contributions: [...(g.contributions || []), {id: `c-${Date.now()}`, amount, date: new Date().toISOString()}]} : g), [selectedMonth]: { ...(prev[selectedMonth] || {}), expenses: [...(prev[selectedMonth]?.expenses || []), {id: `exp-${Date.now()}`, ...expense, createdAt: new Date().toISOString()}] }}));
    };
    const handleDeleteSavingsGoal = (id) => { if(window.confirm('Delete savings goal? This will not remove contributions from expenses.')) { setAllData(prev => ({...prev, savingsGoals: (prev.savingsGoals || []).filter(g => g.id !== id)}));}};
  
    const handleIntelligentExpenseAdd = (item) => {
        if (item.category === 'Debt Payment') { handleAddDebtPayment(item.source, item.amount); }
        else if (item.category === 'Savings') { handleAddContribution(item.source, item.amount); }
        else { handleAddItem('expense', item); }
    };

    const renderContent = () => {
        const props = { formatCurrency, cancelEdit, theme, debts: allData.debts, savingsGoals: allData.savingsGoals };
        const expenseCats = ['Essentials', 'Lifestyle', 'Health', 'Education', 'Utilities', 'Investment', 'Debt Payment', 'Savings', 'Other'];
        switch (activeTab) {
            case 'dashboard': return <DashboardTab allData={allData} selectedMonth={selectedMonth} {...props} />;
            case 'summary': return <SummaryTab totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance} totalDebt={totalOpenDebt} {...props} />;
            case 'accounts': return <AccountsTab totalAssets={totalAssets} totalLiabilities={totalOpenDebt} netWorth={netWorth} {...props} />;
            case 'calculator': return <CalculatorTab />;
            case 'investments': return <InvestmentsTab investments={investments} onAdd={handleAddInvestment} onUpdate={handleUpdateInvestment} onDelete={handleDeleteInvestment} {...props} />;
            case 'savings': return <SavingsTab savingsGoals={savingsGoals} onCreateGoal={handleCreateSavingsGoal} onAddContribution={handleAddContribution} onDeleteGoal={handleDeleteSavingsGoal} {...props} />;
            case 'debt': return <DebtTab debts={debts} onAddDebt={handleAddDebt} onDeleteDebt={handleDeleteDebt} onAddPayment={handleAddDebtPayment} {...props} />;
            case 'income': return <DataTable title="Income" data={incomes} type="income" onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onEditItem={handleEditItem} editingItem={editingItem} {...props} categories={[]} />;
            case 'expenses': return <DataTable title="Expenses" data={expenses} type="expense" onAddItem={(type, item) => handleIntelligentExpenseAdd(item)} onDeleteItem={(type, id) => handleDeleteItem('expense', id)} onEditItem={(type, item) => handleEditItem('expense', item)} editingItem={editingItem} {...props} categories={expenseCats} />;
            default: return <DashboardTab allData={allData} totalIncome={totalIncome} totalExpenses={totalExpenses} {...props} />;
        }
    };

    return (
        <div className="app-container">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Container fluid="lg" className="p-3 p-md-4">
                <MonthSelector selectedMonth={selectedMonth} changeMonth={changeMonth} />
                <main className="mt-4">{renderContent()}</main>
            </Container>
        </div>
    );
};
export default App;
