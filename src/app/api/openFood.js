const formatAllergen = (allergen) => {
  return allergen.replace("en:", "").replace(/_/g, " ").trim()
};


export const fetchBatchAllergens = async (ingredients) => {
  const results = await Promise.allSettled(
    ingredients.map(async (ingredient) => {
      console.log("Fetching data for ingredient:", ingredient);
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v2/search?search_terms=${ingredient}&fields=product_name,ingredients_text,allergens`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${ingredient}`);
        }

        const data = await response.json();

        if (!data.products || data.products.length === 0) {
          return { ingredient, allergens: [], warning: "Ingredient not found." };
        }
        const allergens = new Set();
        data.products.forEach((product) => {
          if (product.allergens && product.allergens.trim() !== "") {
            product.allergens.split(",").forEach((allergen) => {
              allergens.add(formatAllergen(allergen));
            });
          }
        });

        return {
          ingredient,
          allergens: Array.from(allergens),
          warning: allergens.size > 0 ? `Contains: ${Array.from(allergens).join(", ")}` : "No known allergens.",
        };
      } catch (error) {
        console.error(`Error fetching allergen info for ${ingredient}:`, error);
        return { ingredient, allergens: [], warning: "API error, please try again later." };
      }
    })
  );

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : { ingredient: "", allergens: [], warning: "Error retrieving data" }
  );
};

