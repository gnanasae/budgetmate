import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Offcanvas } from 'react-bootstrap';
import { LayoutDashboard, Search, Moon, Sun, Menu } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, theme, toggleTheme, searchQuery, setSearchQuery }) => {
    const [showMenu, setShowMenu] = useState(false);
    const handleClose = () => setShowMenu(false);
    const handleShow = () => setShowMenu(true);

    const handleNavClick = (tab) => {
        setActiveTab(tab);
        handleClose();
    };
    
    const mainNavItems = ['dashboard', 'summary', 'accounts'];
    const menuItems = ['income', 'expenses', 'debt', 'investments', 'savings', 'calculator'];

    return (
        <>
            <Navbar bg="body-tertiary" expand={false} className="shadow-sm mb-3" sticky="top">
                <Container fluid>
                    <Navbar.Brand href="#home" onClick={() => setActiveTab('dashboard')} className="d-flex align-items-center">
                        <LayoutDashboard className="me-2"/>
                        BudgetMate
                    </Navbar.Brand>
                    <div className="d-flex align-items-center">
                         <Form className="d-none d-sm-flex" onSubmit={(e) => e.preventDefault()}>
                            <FormControl
                                type="search"
                                placeholder="Search..."
                                className="me-2"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form>
                        <Button variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} onClick={toggleTheme} className="d-none d-sm-block me-2">
                           {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        </Button>
                        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow} />
                    </div>
                </Container>
            </Navbar>

            <Offcanvas show={showMenu} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                       {mainNavItems.map(item => (
                            <Nav.Link key={item} active={activeTab === item} onClick={() => handleNavClick(item)} className="text-capitalize">{item}</Nav.Link>
                        ))}
                         <NavDropdown.Divider />
                         {menuItems.map(item => (
                            <Nav.Link key={item} active={activeTab === item} onClick={() => handleNavClick(item)} className="text-capitalize">{item}</Nav.Link>
                        ))}
                    </Nav>
                     <div className="d-sm-none mt-3">
                        <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                            <FormControl type="search" placeholder="Search..." className="me-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </Form>
                     </div>
                     <div className="d-flex justify-content-between align-items-center mt-3 p-2 border-top">
                        <span>Dark Mode</span>
                        <Form.Check type="switch" id="theme-switch" checked={theme === 'dark'} onChange={toggleTheme} />
                     </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};
export default Header;
