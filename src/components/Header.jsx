import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import { LayoutDashboard, Search, Moon, Sun } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, theme, toggleTheme, searchQuery, setSearchQuery }) => {
    const mainNavItems = ['dashboard', 'summary', 'accounts'];
    const menuItems = ['income', 'expenses', 'debt', 'investments', 'savings', 'calculator'];
    
    return (
        <Navbar bg={theme} variant={theme} expand="lg" sticky="top" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand href="#home" onClick={() => setActiveTab('dashboard')} className="d-flex align-items-center">
                    <LayoutDashboard className="me-2"/>
                    BudgetMate
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {mainNavItems.map(item => (
                            <Nav.Link key={item} active={activeTab === item} onClick={() => setActiveTab(item)} className="text-capitalize">{item}</Nav.Link>
                        ))}
                    </Nav>
                    <Form className="d-flex mx-auto my-2 my-lg-0" onSubmit={(e) => e.preventDefault()}>
                        <FormControl
                            type="search"
                            placeholder="Search transactions..."
                            className="me-2"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form>
                    <Nav>
                        <NavDropdown title="Menu" id="basic-nav-dropdown" align="end">
                            {menuItems.map(item => (
                                <NavDropdown.Item key={item} active={activeTab === item} onClick={() => setActiveTab(item)} className="text-capitalize">{item}</NavDropdown.Item>
                            ))}
                        </NavDropdown>
                        <Button variant="outline-secondary" onClick={toggleTheme} className="ms-2 d-flex align-items-center">
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default Header;
