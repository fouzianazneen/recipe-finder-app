document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.querySelector('.searchBox');
    const searchBtn = document.querySelector('.searchBtn');
    const recipeContainer = document.querySelector('.Recipe-container');
    const recipeDetailsContent = document.querySelector('.recipe-details-content');
    const recipeDetailsPopup = document.querySelector('.recipe-details');
    const recipeCloseBtn = document.querySelector('.recipe-close-btn');

    const fetchRecipes = async (query) => {
        recipeContainer.innerHTML = "<h2>Fetching Recipe...</h2>";
        try {
            const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const response = await data.json();

            recipeContainer.innerHTML = "";
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h2>${meal.strMeal}</h2>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                recipeContainer.appendChild(recipeDiv);
            });
        } catch (error) {
            recipeContainer.innerHTML = "<h2>Error in Fetching Recipe...</h2>";
        }
    }

    const fetchIngredients = (meal) => {
        let ingredientsList = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) {
                const measure = meal[`strMeasure${i}`];
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            } else {
                break;
            }
        }
        return ingredientsList;
    }

    const openRecipePopup = (meal) => {
        recipeDetailsContent.innerHTML = `
            <h2 class="recipeName">${meal.strMeal}</h2>
            <h3>Ingredients:</h3>
            <ul class="ingredientslist">${fetchIngredients(meal)}</ul>
        `;

        recipeDetailsPopup.style.display = 'block';
    }

    recipeCloseBtn.addEventListener('click', () => {
        recipeDetailsPopup.style.display = 'none';
    });

    searchBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const searchInput = searchBox.value.trim();
        await fetchRecipes(searchInput);
    });
});
