import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [menuData, setMenuData] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock ingredients database
    const mockIngredientsDB = {
        'Kadai Paneer': [
            { name: 'Paneer', quantity: '200g' },
            { name: 'Onion', quantity: '2 large' },
            { name: 'Capsicum', quantity: '1 medium' },
            { name: 'Tomato Puree', quantity: '1/2 cup' },
            { name: 'Ginger Garlic Paste', quantity: '1 tbsp' },
            { name: 'Kadai Masala', quantity: '2 tbsp' },
            { name: 'Cream', quantity: '2 tbsp' },
            { name: 'Coriander Leaves', quantity: 'for garnish' },
        ]
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://nkb-backend-ccbp-media-static.s3-ap-south-1.amazonaws.com/ccbp_beta/media/content_loading/uploads/c1613f6a-8178-43b1-82c4-35ededd08ef0_data%20%287%29.json");
                const data = await response.json();

                // Distribute items across categories for better demo
                const enhancedData = data.map((item, index) => {
                    let mealType = 'MAIN COURSE';
                    // Distribute items across categories
                    const categoryIndex = index % 4;
                    if (categoryIndex === 0) mealType = 'STARTER';
                    else if (categoryIndex === 1) mealType = 'MAIN COURSE';
                    else if (categoryIndex === 2) mealType = 'DESSERT';
                    else mealType = 'CLASSIC';

                    return {
                        ...item,
                        mealType,
                        ingredients: mockIngredientsDB[item.name] || [
                            { name: 'Oil', quantity: '2 tbsp' },
                            { name: 'Salt', quantity: 'to taste' },
                            { name: 'Black Pepper', quantity: '1/4 tsp' },
                        ]
                    };
                });

                setMenuData(enhancedData);
            } catch (error) {
                console.error("Error fetching menu:", error);
                setMenuData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleDish = (dish) => {
        setSelectedDishes((prev) => {
            const isSelected = prev.find((item) => item.id === dish.id);
            if (isSelected) {
                return prev.filter((item) => item.id !== dish.id);
            } else {
                return [...prev, dish];
            }
        });
    };

    const getSelectedCountByCategory = (mealType) => {
        return selectedDishes.filter((dish) => dish.mealType.toUpperCase() === mealType.toUpperCase()).length;
    };

    const totalSelectedCount = selectedDishes.length;

    const value = useMemo(() => ({
        menuData,
        loading,
        selectedDishes,
        toggleDish,
        getSelectedCountByCategory,
        totalSelectedCount
    }), [menuData, loading, selectedDishes]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
