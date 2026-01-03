import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChefHat } from 'lucide-react';

const DishCard = ({ dish }) => {
    const { toggleDish, selectedDishes } = useCart();
    const [isExpanded, setIsExpanded] = useState(false);

    const isSelected = selectedDishes.some((item) => item.id === dish.id);
    
    // Clean description: remove placeholder text like [MOCK_DATA_PLACEHOLDER]
    const cleanDescription = dish.description.replace(/\[.*?\]/g, '').trim();
    
    const shortDescription = cleanDescription.substring(0, 80);
    const needsExpansion = cleanDescription.length > 80;

    return (
        <div className={`dish-card ${isSelected ? 'selected' : ''}`}>
            {isSelected && <div className="selected-badge">✓ Selected</div>}
            <div className="dish-image-container">
                {dish.image ? (
                    <img src={dish.image} alt={dish.name} className="dish-image" />
                ) : (
                    <div className="dish-image-placeholder">
                        <ChefHat size={48} />
                    </div>
                )}
            </div>
            <div className="dish-info">
                <h3 className="dish-name">{dish.name}</h3>
                <p className={`dish-description ${isExpanded ? 'expanded' : ''}`}>
                    {isExpanded ? cleanDescription : `${shortDescription}${needsExpansion ? '...' : ''}`}
                </p>
                <div className="card-actions">
                    {needsExpansion && (
                        <button
                            className="read-more-btn"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                    <Link to={`/dish/${dish.id}/ingredients`} className="ingredient-link">
                        🍽️ Ingredient
                    </Link>
                </div>
                <button
                    className={`add-remove-btn ${isSelected ? 'remove' : 'add'}`}
                    onClick={() => toggleDish(dish)}
                >
                    {isSelected ? '✕ Remove' : '+ Add'}
                </button>
            </div>
        </div>
    );
};

export default DishCard;
