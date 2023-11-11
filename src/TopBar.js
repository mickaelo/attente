import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    UnorderedListOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import Logo from './logo.png'; // Assure-toi de remplacer le chemin avec le chemin correct de ton logo

const { Header } = Layout;

const Topbar = () => {
    return < Header style={{ background: '#bad1e6', padding: 0, display: 'flex', justifyContent: 'space-between' }
    }>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="Logo" style={{ width: '40px', height: '40px', margin: '0 16px' }} />
            <span style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>Nom de l'Application</span>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
            <Menu.Item key="1" icon={<UnorderedListOutlined />}>
                <Link to="/file-attente" style={{ color: '#fff' }}>File d'Attente</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TeamOutlined />}>
                <Link to="/liste-patients" style={{ color: '#fff' }}>Liste des Patients</Link>
            </Menu.Item>
        </Menu>
    </Header >
};

export default Topbar;
