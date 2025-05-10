import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className={` bg-gray-100  flex-grow ${className}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
