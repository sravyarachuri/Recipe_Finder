// ===============================
// DOM Elements
// ===============================
const ingredientInput = document.getElementById('ingredientInput');
const maxTime = document.getElementById('maxTime');
const cuisine = document.getElementById('cuisine');
const diet = document.getElementById('diet');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const recipesContainer = document.getElementById('recipesContainer');
const loading = document.getElementById('loading');
const recipeModal = document.getElementById('recipeModal');
const modalContent = recipeModal.querySelector('.modal-content');
const menuBtn = document.querySelector('.menu-btn');
const sidePanel = document.getElementById('sidePanel');
const heroSection = document.getElementById('heroSection');

let favorites = [];
// ===============================
// Mock Recipes (for fallback)
// ===============================
const mockRecipes = [
    {
        id: 101,
        title: "Spaghetti Carbonara",
        image: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
        cuisines: ["Italian"],
        diets: ["Non-Vegetarian"],
        readyInMinutes: 25,
        extendedIngredients: [
            { original: "200g Spaghetti" },
            { original: "100g Pancetta" },
            { original: "2 Eggs" },
            { original: "50g Parmesan cheese" },
            { original: "Black Pepper to taste" }
        ],
        instructions: "Cook pasta. Fry pancetta. Mix eggs and cheese. Combine everything."
    },
    {
        id: 102,
        title: "Veggie Salad Bowl",
        image: "https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=977&auto=format&fit=crop",
        cuisines: ["International"],
        diets: ["Vegetarian", "Vegan"],
        readyInMinutes: 15,
        extendedIngredients: [
            { original: "Lettuce" },
            { original: "Cherry Tomatoes" },
            { original: "Cucumber" },
            { original: "Olive Oil" },
            { original: "Lemon Juice" }
        ],
        instructions: "Chop veggies. Mix dressing. Toss together."
    },
    {
        id: 103,
        title: "Chocolate Brownies",
        image: "https://images.unsplash.com/photo-1705472017435-7a820b01f36c?q=80&w=1470&auto=format&fit=crop",
        cuisines: ["Dessert"],
        diets: ["Vegetarian"],
        readyInMinutes: 45,
        extendedIngredients: [
            { original: "200g Dark Chocolate" },
            { original: "150g Butter" },
            { original: "200g Sugar" },
            { original: "3 Eggs" },
            { original: "100g Flour" }
        ],
        instructions: "Melt chocolate and butter. Mix sugar and eggs. Combine with flour. Bake at 180°C for 25 mins."
    }
];
const categories = [
    { name: "Drinks", image: "https://plus.unsplash.com/premium_photo-1687354234043-4c209d942365?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Salads", image: "https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=977&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Desserts", image: "https://images.unsplash.com/photo-1705472017435-7a820b01f36c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Snacks", image: "https://media.istockphoto.com/id/1350389765/photo/image-of-wire-metal-cooling-rack-and-wooden-chopping-board-full-of-fried-samosas-stuffed-with.jpg?s=1024x1024&w=is&k=20&c=ZaBuin32pq6ZCMU-OyS95NDJrgF6DLx5bw0Yanl7ahg=" },
    { name: "Main Courses", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Soups", image: "https://cakeworkorange.com/wp-content/uploads/2023/11/20231128_140418_0000-1.png" }
];

function showCategories() {
    recipesContainer.style.display = 'none';
    categoriesContainer.classList.remove('hidden');
    categoriesContainer.innerHTML = '';

    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <img src="${cat.image}" alt="${cat.name}">
            <div class="category-name">${cat.name}</div>
        `;
        categoriesContainer.appendChild(card);

        // click on category to filter recipes
        card.addEventListener('click', () => {
            cuisine.value = ""; // reset filters
            diet.value = "";
            ingredientInput.value = "";
            fetchRecipesByCategory(cat.name);
        });
    });
}

function fetchRecipesByCategory(categoryName) {
    categoriesContainer.classList.add('hidden');
    recipesContainer.style.display = 'grid';
    showLoading();
    fetch(`${baseURL}?apiKey=${apiKey}&addRecipeInformation=true&number=12&cuisine=${categoryName}`)
        .then(res => res.json())
        .then(data => displayRecipes(data.results))
        .finally(() => hideLoading());
}
// ===============================
// Category Recipe Details
// ===============================
function displayCategoryRecipes(recipes) {
    recipesContainer.innerHTML = '';
    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">No recipes found.</p>';
        recipesContainer.style.display = 'block';
        return;
    }
    recipesContainer.style.display = 'grid';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="card-body">
                <h3>${recipe.title}</h3>
                <p>Cuisine: ${recipe.cuisines ? recipe.cuisines.join(', ') : 'N/A'}</p>
                <p>Diet: ${recipe.diets ? recipe.diets.join(', ') : 'N/A'}</p>
                <p>Time: ${recipe.readyInMinutes || 'N/A'} mins</p>
                <button class="viewBtn">View Recipe</button>
            </div>
            <button class="favorite-btn ${isFavorite(recipe) ? 'liked' : ''}">
                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        `;
        recipesContainer.appendChild(card);

        // 🔥 Modal open for category recipe
        card.querySelector('.viewBtn').addEventListener('click', () => showModal(recipe.id));

        // ❤️ Favorite toggle
        card.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(recipe, card.querySelector('.favorite-btn')));
    });
}

//  fetchRecipesByCategory
function fetchRecipesByCategory(categoryName) {
    categoriesContainer.classList.add('hidden');
    recipesContainer.style.display = 'grid';
    showLoading();

    
    fetch(`${baseURL}?apiKey=${apiKey}&addRecipeInformation=true&number=12&query=${categoryName}`)
        .then(res => res.json())
        .then(data => displayCategoryRecipes(data.results))
        .finally(() => hideLoading());
}


// ===============================
// Side Panel Buttons
// ===============================
const homeBtn = document.getElementById('homeBtn');
const allRecipesBtn = document.getElementById('allRecipesBtn');
const categoriesBtn = document.getElementById('categoriesBtn');
const favBtn = document.getElementById('favoritesBtn');
const aboutBtn = document.getElementById('aboutBtn');

// ===============================
// API
// ===============================
const apiKey = document.getElementById('apiKey').value;
const baseURL = "https://api.spoonacular.com/recipes/complexSearch";
const recipeInfoURL = "https://api.spoonacular.com/recipes";

// ===============================
// Hamburger Menu
// ===============================
menuBtn.addEventListener('click', () => {
    sidePanel.classList.toggle('show');
    menuBtn.classList.toggle('open');
});

// ===============================
// Loading
// ===============================
function showLoading() {
    loading.classList.remove('hidden');
    recipesContainer.innerHTML = '';
}
function hideLoading() {
    loading.classList.add('hidden');
}

// ===============================
// Display Recipes
// ===============================
function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    if (!recipes || recipes.length === 0) {
        recipesContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">No recipes found.</p>';
        recipesContainer.style.display = 'block';
        return;
    }
    recipesContainer.style.display = 'grid';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="card-body">
                <h3>${recipe.title}</h3>
                <p>Cuisine: ${recipe.cuisines ? recipe.cuisines.join(', ') : 'N/A'}</p>
                <p>Diet: ${recipe.diets ? recipe.diets.join(', ') : 'N/A'}</p>
                <p>Time: ${recipe.readyInMinutes || 'N/A'} mins</p>
                <button class="viewBtn">View Recipe</button>
            </div>
            <button class="favorite-btn ${isFavorite(recipe) ? 'liked' : ''}">
                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        `;
        recipesContainer.appendChild(card);

        card.querySelector('.viewBtn').addEventListener('click', () => showModal(recipe.id));
        card.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(recipe, card.querySelector('.favorite-btn')));
    });
}

// ===============================
// Favorite Check
// ===============================
function isFavorite(recipe) {
    return favorites.some(fav => fav.id === recipe.id);
}

// ===============================
// Recipe Modal
// ===============================
async function showModal(recipeId) {
    showLoading();
    try {
        let recipe = mockRecipes.find(r => r.id === recipeId);
        if (!recipe) {
        const res = await fetch(`${recipeInfoURL}/${recipeId}/information?apiKey=${apiKey}`);
        recipe = await res.json();
        }

        modalContent.innerHTML = `
            <button class="close-btn">&times;</button>
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="tabs">
                <button class="tab-btn active" data-tab="ingredients">Ingredients</button>
                <button class="tab-btn" data-tab="instructions">Instructions</button>
                <button class="tab-btn" data-tab="nutrition">Nutrition</button>
            </div>
            <div class="tab-content" id="ingredients">
                <ul>${recipe.extendedIngredients.map(i => `<li>${i.original}</li>`).join('')}</ul>
            </div>
            <div class="tab-content hidden" id="instructions">
                <p>${recipe.instructions || 'No instructions provided.'}</p>
            </div>
            <div class="tab-content hidden" id="nutrition">
                <ul>${recipe.nutrition?.nutrients?.map(n => `<li>${n.name}: ${n.amount} ${n.unit}</li>`).join('') || 'Nutrition info not available.'}</ul>
            </div>
        `;

        // Tabs
        const tabButtons = modalContent.querySelectorAll('.tab-btn');
        const tabContents = modalContent.querySelectorAll('.tab-content');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.add('hidden'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.remove('hidden');
            });
        });

        modalContent.querySelector('.close-btn').addEventListener('click', hideModal);
        recipeModal.classList.add('show');
    } catch (err) {
        alert("Failed to fetch recipe details.");
        console.error(err);
    }
    hideLoading();
}

function hideModal() {
    recipeModal.classList.remove('show');
}
recipeModal.addEventListener('click', e => {
    if (e.target === recipeModal) hideModal();
});

// ===============================
// Favorites
// ===============================
function toggleFavorite(recipe, heartBtn) {
    const index = favorites.findIndex(fav => fav.id === recipe.id);
    if (index > -1) {
        favorites.splice(index, 1);
        heartBtn.classList.remove('liked');
    } else {
        favorites.push(recipe);
        heartBtn.classList.add('liked');
    }
}

// ===============================
// Fetch Recipes
// ===============================
async function fetchRecipes() {
    showLoading();
    try {
        const params = new URLSearchParams({
            apiKey: apiKey,
            addRecipeInformation: true,
            number: 20,
            includeIngredients: ingredientInput.value,
            cuisine: cuisine.value,
            diet: diet.value,
            maxReadyTime: maxTime.value
        });
        const res = await fetch(`${baseURL}?${params.toString()}`);
        const data = await res.json();
        displayRecipes(data.results);
    } catch (err) {
        console.error(err);
        console.warn("Using mock recipes instead.");
        displayRecipes(mockRecipes);
    }
    hideLoading();
}

// ===============================
// Random Recipe
// ===============================
async function fetchRandomRecipe() {
    showLoading();
    try {
        const res = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1`);
        const data = await res.json();
        const recipe = data.recipes[0];
        showModal(recipe.id);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
        console.error(err);
        alert("Failed to fetch random recipe.");
    }
    hideLoading();
}

// ===============================
// Event Listeners
// ===============================
searchBtn.addEventListener('click', fetchRecipes);
randomBtn.addEventListener('click', fetchRandomRecipe);
// ===============================
// Live Ingredient Search + Auto Scroll
// ===============================
let searchTimeout;
ingredientInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (ingredientInput.value.trim() !== "") {
            heroSection.style.display = 'none';   // hide hero
            categoriesContainer.classList.add('hidden'); // hide categories
            fetchRecipes().then(() => {
                recipesContainer.scrollIntoView({ behavior: "smooth" });
            });
        } else {
            recipesContainer.innerHTML = '';
            recipesContainer.style.display = 'none';
            heroSection.style.display = 'block'; // show home again if input is cleared
        }
    }, 800); // wait 0.8s after typing stops
});

// ===============================
// Side Panel Buttons
// ===============================
homeBtn.addEventListener('click', () => {
    heroSection.style.display = 'block';
    recipesContainer.style.display = 'none';
    categoriesContainer.classList.add('hidden');
});

allRecipesBtn.addEventListener('click', () => {
    heroSection.style.display = 'none';
    categoriesContainer.classList.add('hidden');
    fetchRecipes(); // will display recipesContainer
});

favBtn.addEventListener('click', () => {
    heroSection.style.display = 'none';
    categoriesContainer.classList.add('hidden');
    if (favorites.length === 0) {
        recipesContainer.innerHTML = '<p style="text-align:center; margin-top:20px;">No favorites yet!</p>';
        recipesContainer.style.display = 'block';
    } else {
        recipesContainer.style.display = 'grid';
        displayRecipes(favorites);
    }
});

categoriesBtn.addEventListener('click', () => {
    heroSection.style.display = 'none';
    recipesContainer.style.display = 'none';
    showCategories(); // this will display categoriesContainer
});

aboutBtn.addEventListener('click', () => {
    heroSection.style.display = 'none';
    recipesContainer.style.display = 'block';
    categoriesContainer.classList.add('hidden');
    recipesContainer.innerHTML = `
    <div class="about-section">
            <div class="about-text">
                <h2>🍴 About <span>RecipeRealm</span></h2>
                <p>At <b>RecipeRealm</b>, we bring flavors from around the world straight to your kitchen. 🌍  
                Discover recipes, explore cuisines, and find inspiration for every meal.</p>

                <p>✨ Our goal is to make cooking <b>fun, easy, and exciting</b> for everyone — whether you’re just starting or already a pro chef.</p>

                <p>💡 Pro Tip: Hit <b>“Secret Recipe”</b> and let us inspire you with something new and delicious!</p>
            </div>
            <div class="about-image">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" alt="Delicious Recipes">
            </div>
        </div>
    `;
    recipesContainer.classList.add('about-section');

});

categoriesBtn.addEventListener('click', () => {
    showCategories();
});

// ===============================
// Initial Load
// ===============================
heroSection.style.display = 'block';
recipesContainer.style.display = 'none';
