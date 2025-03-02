# ** README Requirements**  

## **1 Setup Instructions**  

### ** Step 1: Clone the Repository**  
Open your terminal and run:  
```sh
git clone https://github.com/Praduman1916/allergen-label-displayer
cd allergen-label-displayer
```

### ** Step 2: Install Dependencies**  
Install the required dependencies:  
```sh
npm install
```

### ** Step 3: Start the Application**  
Run the development server with:  
```sh
npm run dev
```
Once started, open your browser and visit-  
```
http://localhost:3000
```

---

## ** 2 How to Use**  

1. **Upload an Excel file (`.xlsx`)** containing recipes using the **drag-and-drop** or **manual upload** option.  
2. **The system will extract the ingredients** and automatically **fetch allergen details**.  
3. **A loading message and spinner** will appear while allergen data is being retrieved.  
4. **If an invalid file** is uploaded, an **error message will dispaly the user**.  
5. **Once the allergen data is loaded,** it will be displayed in a **structured table**.  
6. **Users can navigate between recipes** using the **Next and Previous** buttons.  
7. **View allergen warnings** displayed in a **clear and organized table**.  

---

## **3 Solution Explanation**  

### ** Approach**  
- **The application allows users to upload an Excel file** that contains a list of **recipes and ingredients**.  
- **It processes the file** to extract ingredient information and ensures that only **supported file formats** are accepted.  
- **The system then fetches allergen details** from an external API **Open Food Facts API** , displaying any **potential allergens** linked to each ingredient.  
- **A smooth user interface** ensures that users can **easily navigate between recipes without delays**.  
- **The entire process is optimized** to handle multiple recipes **efficiently** and display results **instantly**.  

### ** Potential Improvements**  
- **Improve the efficiency of API calls** to minimize repeated requests for the same ingredients.  
- **Enhance the user interface** with better **design elements** for loading states, error messages, and warnings.  
- **Expand file support** to include additional formats such as **CSV** for better flexibility.  
- **Optimize the system** to handle **larger datasets** and improve **performance** for bulk processing.  

---