import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const CalculatorTab = () => {
    const [input, setInput] = useState('');
    const handleButtonClick = (value) => {
        if (value === '=') {
            try {
                const sanitizedInput = input.replace(/[^0-9+\-*/().]/g, '');
                const result = new Function('return ' + sanitizedInput)();
                setInput(result.toString());
            } catch { setInput('Error'); }
        } else if (value === 'C') { setInput(''); }
        else { setInput(input + value); }
    };
    const buttons = ['7','8','9','/','4','5','6','*','1','2','3','+','0','.','=','-'];
    return (
        <Card style={{ maxWidth: '300px' }} className="mx-auto shadow-lg">
            <Card.Body>
                <div className="bg-light p-3 mb-3 text-end h3 font-monospace rounded">{input || '0'}</div>
                <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {buttons.map(btn => (
                        <Button key={btn} variant="light" onClick={() => handleButtonClick(btn)} className="p-3 fs-5">
                            {btn}
                        </Button>
                    ))}
                     <Button onClick={() => handleButtonClick('C')} variant="danger" className="p-3 fs-5" style={{ gridColumn: 'span 4' }}>
                        Clear
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};
export default CalculatorTab;