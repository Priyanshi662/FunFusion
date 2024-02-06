const searchbox=document.querySelector('.searchbox');
const searchbtn=document.querySelector('.search-btn');
const recipecontainer=document.querySelector('.recipe-container');
const recipedetailscontent=document.querySelector('.recipe-details-content');
const recipeclosebtn=document.querySelector('.recipe-close-btn');
const fetchrecipes= async (query)=>{
    recipecontainer.innerHTML="<h2>Fetching recipes...</h2>"
    try {
        const data= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

    const response= await data.json();
    recipecontainer.innerHTML="";
    response.meals.forEach(meal => {
        // normal for loop bhi lga skte h
        const recipediv=document.createElement('div');
        recipediv.classList.add('recipe');// meal islie lere h bcoz hmne foreach loop mei element ka naam meal lia h toh usse acccess krenge sbko

        recipediv.innerHTML=`
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> category</p>`
        const button= document.createElement('button');
        button.textContent="View Recipe";
        recipediv.appendChild(button);
        button.addEventListener('click', ()=>{
            //pop-up window for recipe
            openRecipePopup(meal);
        });

        recipecontainer.appendChild(recipediv);// container mei jo element create kia h usko append krdia


        
    });
    }
     catch (error) {
        recipecontainer.innerHTML="<h2>Error in fetching recipes...</h2>"
        
    }
    
    
    //console.log(response.meals[0]);// jo pehla meal tha vo access ho gya

}
const fetchIngredients=(meal)=>{
    //console.log(meal);
    let ingredientslist="";
    for(let i=1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure=meal[`strMeasure${i}`];
            ingredientslist+=`<li>${measure} ${ingredient}</li>`


        }
        else{
            break;

        }
    }
    return ingredientslist;


}


const openRecipePopup=(meal)=>{
    recipedetailscontent.innerHTML=`
    <h2 class="recipename">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientlist">${fetchIngredients(meal)}</ul>
    <div  class="recipeinstructions">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    </div>
    
    
    
    `
    
    recipedetailscontent.parentElement.style.display="block";

}
recipeclosebtn.addEventListener('click', ()=>{
    recipedetailscontent.parentElement.style.display="none";
});


searchbtn.addEventListener('click', (e)=>{
    e.preventDefault();//autosubmit ni hoega , page refresh ni hga button click krne p
const searchinput=searchbox.value.trim();
if(!searchinput){
    recipecontainer.innerHTML=`<h2>Type the meal in the search box.</h2>`;
    return;
}
   fetchrecipes(searchinput);
});

  // ``-> template literals