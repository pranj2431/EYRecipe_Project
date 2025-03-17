import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import AddRecipe from '../components/AddRecipe';
import MyRecipes from './MyRecipes';
import axios from 'axios';


const Home = ({ onAddRecipe }) => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Guest';
    const [recipes, setRecipes] = useState([]);


    const defaultRecipes = [
        {
            id: 1,
            name: 'Aam ka Panna',
            ingredients: ['2 medium-sized unripe green mangoes',
                '▢2 cups water',
                '▢1.5 cups sugar or jaggery powder',
                '▢1 teaspoon cardamom powder',
                '▢1 teaspoon roasted cumin powder',
                '▢¼ teaspoon black pepper powder or crushed black pepper',
                '▢2 teaspoons black salt'],
            time: '20 minutes',
            image: 'https://www.ruchiskitchen.com/wp-content/uploads/2020/05/Aam-ka-Panna-recipe-01-768x1152.jpg.webp'
        },
        {
            id: 2,
            name: 'Misal Pav',
            ingredients: ['▢2 cups moth bean sprouts (matki sprouts)',
                '▢1 onion medium to large – finely chopped',
                '▢1 to 1.5 tablespoon Goda Masala or kala masala',
                '▢8 to 10 pav (bread rolls)',
                '▢½ cup finely chopped onions',
                '▢½ to 1 cup thick sev or farsan (chiwda)',
                '▢1 lemon & chopped coriander leaves'],
            time: '1 hour',
            image: 'https://t3.ftcdn.net/jpg/11/24/33/06/240_F_1124330653_4G7Z4V4bC1So8JIFfOae2lT1ZvZEu6sl.jpg'
        },
        {
            id: 3,
            name: 'Sabudana Vada',
            ingredients: ['1 cup sabudana',
                '▢4 potatoes – medium-sized',
                '▢½ cup peanuts',
                '▢1 teaspoon cumin seeds',
                '▢2 teaspoons lemon juice (optional)',
                '▢1.5 teaspoon sugar',
                '▢rock salt',
                '▢oil as required, for deep frying'],
            time: '5 minutes',
            image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/sabudana-vada-3-500x500.jpg'
        }
    ];

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (token) {
                    // Fetch user recipes if logged in
                    const response = await axios.get('https://ey-recipeproject.onrender.com/recipes');
                    setRecipes(response.data.length > 0 ? response.data : defaultRecipes);
                } else {
                    // If not logged in, show default recipes
                    setRecipes(defaultRecipes);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setRecipes(defaultRecipes); // Fallback to default recipes
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="container-fluid p-0">
            {/* Hero Slider Section */}
            <HeroSlider />


            {/* My Recipes Section - Displaying Cards */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Featured Recipes</h2>
                <div className="row">
                    {recipes.map((recipe) => (
                        <div className="col-md-4" key={recipe.id}>
                            <div className="card mb-3">
                                <img src={recipe.image} className="card-img-top" alt={recipe.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.name}</h5>
                                    <p><strong>Time:</strong> {recipe.time}</p>
                                    <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                                    <button className="btn btn-primary">View Recipe</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default Home;
