"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { fetchBatchAllergens } from "./api/openFood";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [allergenData, setAllergenData] = useState({});
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAllergensForRecipes = async (recipes) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const allergenResults = {};
      for (const recipe of recipes) {
        const batchResults = await fetchBatchAllergens(recipe.ingredients);
        allergenResults[recipe.recipeName] = batchResults;
      }
      setAllergenData(allergenResults);
    } catch (error) {
      console.log("see error--", error)
      setErrorMessage("Failed to fetch allergen data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeChange = (direction) => {
    setSelectedRecipeIndex((prevIndex) => {
      if (direction === "next" && prevIndex < recipes.length - 1) {
        return prevIndex + 1;
      } else if (direction === "prev" && prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex; 
    });
  };

  return (
    <div className="container">
      <h1 className="m-10">Allergen Label Displayer </h1>
      <FileUpload
        onFileUpload={(data) => {
          setRecipes(data);
          fetchAllergensForRecipes(data);
        }}
      />

      {loading && <p className="loading">Fetching allergen data, please wait...</p>}
      {loading && <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {recipes.length > 0 && !loading && (
        <div className="recipe-section">
          <div className="navigation">
          { selectedRecipeIndex>0&& <button onClick={() => handleRecipeChange("prev")}>&larr;&nbsp;Previous</button>}
            <h2 className="flex w-full text-center justify-center">{recipes[selectedRecipeIndex].recipeName}</h2>
           {selectedRecipeIndex < recipes.length - 1 && <button onClick={() => handleRecipeChange("next")}>Next&nbsp;&rarr;</button>}
          </div>

          <h3>Ingredients:</h3>
          <ul className="ingredients-list">
            {recipes[selectedRecipeIndex].ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>

          <h3>Allergens:</h3>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Allergens</th>
                <th>Warnings</th>
              </tr>
            </thead>
            <tbody>
              {allergenData[recipes[selectedRecipeIndex]?.recipeName]?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ingredient}</td>
                  <td>{item.allergens.length > 0 ? item.allergens.join(", ") : "None"}</td>
                  <td>{item.warning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
