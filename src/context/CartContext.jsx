import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';

const CartContext = createContext();

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
    ],
    'Butter Chicken': [
        { name: 'Chicken', quantity: '500g' },
        { name: 'Tomato Puree', quantity: '1 cup' },
        { name: 'Butter', quantity: '50g' },
        { name: 'Cream', quantity: '1/2 cup' },
        { name: 'Kasuri Methi', quantity: '1 tsp' },
    ],
    'Gulab Jamun': [
        { name: 'Khoya', quantity: '250g' },
        { name: 'Paneer', quantity: '50g' },
        { name: 'Sugar', quantity: '500g' },
        { name: 'Cardamom', quantity: '4-5' },
    ]
};

const dishImages = {
    'STARTER': 'https://images.unsplash.com/photo-1601050690597-df056fb352ba?auto=format&fit=crop&w=800&q=80',
    'MAIN COURSE': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    'DESSERT': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    'CLASSIC': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
};

// eslint-disable-next-line react-refresh/only-export-components
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
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://nkb-backend-ccbp-media-static.s3-ap-south-1.amazonaws.com/ccbp_beta/media/content_loading/uploads/c1613f6a-8178-43b1-82c4-35ededd08ef0_data%20%287%29.json");
                const data = await response.json();

                // Distribute items across categories and add variety
                const enhancedData = data.map((item, index) => {
                    let mealType = 'MAIN COURSE';
                    const categoryIndex = index % 4;
                    if (categoryIndex === 0) mealType = 'STARTER';
                    else if (categoryIndex === 1) mealType = 'MAIN COURSE';
                    else if (categoryIndex === 2) mealType = 'DESSERT';
                    else mealType = 'CLASSIC';

                    // Make names more realistic by removing trailing numbers if any, or adding variety
                    const baseName = item.name.replace(/\d+$/, '').trim();
                    const name = `${baseName} ${index + 1}`;
                    
                    // Add a more descriptive text to test "Read More"
                    const fullDescription = `${item.description} This exquisite dish is prepared using traditional methods passed down through generations. Our chefs use only the freshest ingredients to ensure a burst of authentic flavors in every bite. Perfect for any celebration or family gathering. [MOCK_DATA_PLACEHOLDER]`;

                    return {
                        ...item,
                        name,
                        mealType,
                        description: fullDescription,
                        image: item.image || dishImages[mealType],
                        ingredients: mockIngredientsDB[baseName] || [
                            { name: 'Special Masala', quantity: '1.5 tbsp' },
                            { name: 'Fresh Herbs', quantity: '1 bunch' },
                            { name: 'Olive Oil', quantity: '2 tbsp' },
                            { name: 'Secret Ingredient', quantity: 'a pinch' },
                        ]
                    };
                });

                setMenuData(enhancedData);
                // Introduce a small delay to showcase the premium loading animation
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            } catch (error) {
                console.error("Error fetching menu:", error);
                setMenuData([]);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleDish = useCallback((dish) => {
        setSelectedDishes((prev) => {
            const isSelected = prev.find((item) => item.id === dish.id);
            if (isSelected) {
                showToast(`${dish.name} removed from selection`, 'remove');
                return prev.filter((item) => item.id !== dish.id);
            } else {
                showToast(`${dish.name} added to selection`, 'add');
                return [...prev, dish];
            }
        });
    }, [showToast]);

    const getSelectedCountByCategory = useCallback((mealType) => {
        return selectedDishes.filter((dish) => dish.mealType.toUpperCase() === mealType.toUpperCase()).length;
    }, [selectedDishes]);

    const totalSelectedCount = selectedDishes.length;

    const value = useMemo(() => ({
        menuData,
        loading,
        selectedDishes,
        toggleDish,
        getSelectedCountByCategory,
        totalSelectedCount,
        toast
    }), [menuData, loading, selectedDishes, toggleDish, getSelectedCountByCategory, totalSelectedCount, toast]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
