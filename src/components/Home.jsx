import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import DishCard from './DishCard';
import { Search, UtensilsCrossed, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Classic'];

const Home = () => {
    const { menuData, loading, getSelectedCountByCategory, totalSelectedCount, toast } = useCart();
    const [activeTab, setActiveTab] = useState('Main Course');
    const [searchQuery, setSearchQuery] = useState('');

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader-container">
                    <div className="loader-ring"></div>
                    <div className="loader-ring"></div>
                    <div className="loader-icon">
                        <UtensilsCrossed size={48} />
                    </div>
                </div>
                <div className="loading-text">Preparing your menu...</div>
            </div>
        );
    }

    const filteredDishes = menuData.filter((dish) => {
        const matchesTab = dish.mealType.toUpperCase() === activeTab.toUpperCase();
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="header-top">
                    <div className="header-title">
                        <UtensilsCrossed size={28} className="title-icon" />
                        <h1>Party Menu</h1>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search dishes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <nav className="category-tabs">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                                    onClick={() => setActiveTab(cat)}
                                    title={cat}
                                >
                                    <span className="tab-label">{cat}</span>
                                    {getSelectedCountByCategory(cat) > 0 && (
                                        <span className="count-badge">{getSelectedCountByCategory(cat)}</span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        <span className="toast-icon">
                            {toast.type === 'add' ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                    </div>
                </div>
            )}

            <main className="dish-list">
                {filteredDishes.length > 0 ? (
                    filteredDishes.map((dish) => (
                        <DishCard key={dish.id} dish={dish} />
                    ))
                ) : (
                    <div className="empty-state">No dishes found in this category.</div>
                )}
            </main>

            <footer className="home-footer">
                <div className="footer-content">
                    <div className="summary">
                        <span className="total-label">Total Selected:</span>
                        <span className="total-count">{totalSelectedCount}</span>
                        <span className="items-text">dish{totalSelectedCount !== 1 ? 'es' : ''}</span>
                    </div>
                    <button 
                        className="continue-btn" 
                        disabled={totalSelectedCount === 0}
                        title={totalSelectedCount === 0 ? 'Select at least one dish' : 'Proceed to checkout'}
                    >
                        {totalSelectedCount === 0 ? 'Select Dishes' : '✓ Continue'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Home;