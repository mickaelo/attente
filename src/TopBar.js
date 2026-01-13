import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    UnorderedListOutlined,
    TeamOutlined,
    MedicineBoxOutlined,
    CalendarOutlined,
    EuroOutlined,
} from '@ant-design/icons';
import Logo from './logo.png'; // Assure-toi de remplacer le chemin avec le chemin correct de ton logo

const { Header } = Layout;

const menuItems = [
    {
        key: '1',
        icon: <UnorderedListOutlined />,
        label: <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>File d'Attente</Link>,
    },
    {
        key: '2',
        icon: <TeamOutlined />,
        label: <Link to="/liste-patients" style={{ color: '#fff', textDecoration: 'none' }}>Liste des Patients</Link>,
    },
    {
        key: '3',
        icon: <MedicineBoxOutlined />,
        label: <Link to="/medications" style={{ color: '#fff', textDecoration: 'none' }}>Médicaments</Link>,
    },
    {
        key: '4',
        icon: <CalendarOutlined />,
        label: <Link to="/agenda" style={{ color: '#fff', textDecoration: 'none' }}>Agenda</Link>,
    },
    {
        key: '5',
        icon: <EuroOutlined />,
        label: <Link to="/accounting" style={{ color: '#fff', textDecoration: 'none' }}>Comptabilité</Link>,
    },
];

const Topbar = () => {
    return (
        <Header style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '0 24px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={Logo} 
                    alt="Logo" 
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        margin: '0 16px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} 
                />
                <span style={{ 
                    color: '#fff', 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                    Sophtalmo
                </span>
            </div>
            <Menu 
                theme="dark" 
                mode="horizontal" 
                defaultSelectedKeys={['1']} 
                style={{ 
                    lineHeight: '64px',
                    background: 'transparent',
                    border: 'none',
                }} 
                items={menuItems} 
            />
        </Header>
    );
};

export default Topbar;
