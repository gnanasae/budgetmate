import React, { useMemo } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import CategoryCard from '../components/CategoryCard';
import { 
    Utensils, Car, Home as HomeIcon, Heart, ShoppingBag, Medkit, 
    Briefcase, Handshake, Landmark, FileText, PiggyBank 
} from 'lucide-react';

const DashboardTab = ({ allData, selectedMonth, formatCurrency }) => {
    const currentMonthData = allData[selectedMonth] || {};
    const { expenses = [], incomes = [] } = currentMonthData;

    const expenseCategories = useMemo(() => {
        const categoryMap = {
            'Food & Drink': { icon: Utensils, color: 'yellow', amount: 0 },
            'Transport': { icon: Car, color: 'blue', amount: 0 },
            'Home Bills': { icon: HomeIcon, color: 'orange', amount: 0 },
            'Self-Care': { icon: Heart, color: 'purple', amount: 0 },
            'Shopping': { icon: ShoppingBag, color: 'red', amount: 0 },
            'Health': { icon: Medkit, color: 'teal', amount: 0 },
            'Other': { icon: FileText, color: 'gray', amount: 0 },
        };
        (expenses || []).forEach(item => {
            let key = item.category;
            if (['Essentials', 'Utilities'].includes(key)) key = 'Home Bills';
            
            if(categoryMap[key]) {
                categoryMap[key].amount += item.amount;
            } else {
                categoryMap['Other'].amount += item.amount;
            }
        });
        return Object.entries(categoryMap).map(([title, data]) => ({ title, ...data }));
    }, [expenses]);

    const incomeCategories = useMemo(() => {
        const incomeMap = {
            'Salary': { icon: Briefcase, color: 'green', amount: 0 },
            'Freelance': { icon: Handshake, color: 'cyan', amount: 0 },
            'Investment': { icon: Landmark, color: 'lime', amount: 0 },
        };
        const otherIncomes = { icon: PiggyBank, color: 'gray', amount: 0 };
        (incomes || []).forEach(item => {
            let found = false;
            for(const key in incomeMap){
                if(item.source.toLowerCase().includes(key.toLowerCase())){
                    incomeMap[key].amount += item.amount;
                    found = true;
                    break;
                }
            }
            if(!found) {
                 otherIncomes.amount += item.amount;
            }
        });
        const result = Object.entries(incomeMap).map(([title, data]) => ({ title, ...data }));
        if(otherIncomes.amount > 0) result.push({title: 'Other', ...otherIncomes});
        return result;
    }, [incomes]);

    const totalExpenses = useMemo(() => (expenses || []).reduce((sum, item) => sum + item.amount, 0), [expenses]);
    const totalIncome = useMemo(() => (incomes || []).reduce((sum, item) => sum + item.amount, 0), [incomes]);

    return (
        <Container fluid="lg">
            <Card className="mb-4 shadow-sm border-0">
                 <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="h5 mb-0 fw-bold">Expense</h3>
                        <h3 className="h5 mb-0 fw-bold">{formatCurrency(totalExpenses)}</h3>
                    </div>
                 </Card.Body>
            </Card>

            <Row xs={2} md={3} lg={4} className="g-3">
                {expenseCategories.map(cat => (
                    <Col key={cat.title}>
                        <CategoryCard {...cat} formatCurrency={formatCurrency} />
                    </Col>
                ))}
            </Row>

            <Card className="my-4 shadow-sm border-0">
                 <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="h5 mb-0 fw-bold">Income</h3>
                        <h3 className="h5 mb-0 fw-bold">{formatCurrency(totalIncome)}</h3>
                    </div>
                 </Card.Body>
            </Card>

            <Row xs={2} md={3} lg={4} className="g-3">
                {incomeCategories.map(cat => (
                    <Col key={cat.title}>
                        <CategoryCard {...cat} formatCurrency={formatCurrency} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
export default DashboardTab;
