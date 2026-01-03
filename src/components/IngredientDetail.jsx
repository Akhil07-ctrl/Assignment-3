import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ChefHat, UtensilsCrossed } from 'lucide-react';

const IngredientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { menuData, loading } = useCart();

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
                <div className="loading-text">Loading Details...</div>
            </div>
        );
    }

    const dish = menuData.find((d) => d.id.toString() === id);

    if (!dish) return (
        <div className="ingredient-container">
            <div className="error-state">
                <p>Dish not found</p>
                <button onClick={() => navigate('/')} className="back-to-menu">← Back to Menu</button>
            </div>
        </div>
    );

    const cleanDescription = dish.description.replace(/\[.*?\]/g, '').trim();

    const ingredients = dish.ingredients || [
        { name: 'Oil', quantity: '2 tbsp' },
        { name: 'Salt', quantity: 'to taste' },
        { name: 'Black Pepper', quantity: '1/4 tsp' },
    ];

    return (
        <div className="ingredient-container">
            <header className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)} title="Go back">
                    <ArrowLeft size={24} />
                </button>
                <div className="header-info">
                    <h1>{dish.name}</h1>
                    <span className="meal-type-badge">{dish.mealType}</span>
                </div>
            </header>

            <main className="detail-content">
                <div className="dish-hero">
                    {dish.image ? (
                        <img src={dish.image} alt={dish.name} className="hero-image" />
                    ) : (
                        <div className="hero-placeholder">
                            <ChefHat size={64} />
                        </div>
                    )}
                </div>

                <div className="dish-summary">
                    <h2>About</h2>
                    <p className="description">{cleanDescription}</p>
                </div>

                <section className="ingredients-section">
                    <h2>🍽️ Ingredients</h2>
                    <ul className="ingredient-list">
                        {ingredients.map((ing, index) => (
                            <li key={index} className="ingredient-item">
                                <span className="ing-name">• {ing.name}</span>
                                <span className="ing-qty">{ing.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default IngredientDetail;
