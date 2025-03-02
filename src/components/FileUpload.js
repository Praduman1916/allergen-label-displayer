"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

const FileUpload = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const extractRecipes = (data) => {
    const headers = data[0].map((header) => header?.trim().toLowerCase());
    const expectedHeaders = ["product", "ingredients"];
    if (headers.length < 2 || !expectedHeaders.every((h) => headers.includes(h))) {
      setError("Invalid file format, first row contains 'Product' and 'Ingredients' as headers.");
      return [];
    }
    const productIndex = headers.indexOf("product");
    const ingredientIndex = headers.indexOf("ingredients");

    const recipes = {};
    for (let i = 1; i < data.length; i++) {
      const recipeName = data[i][productIndex]?.trim();
      const ingredient = data[i][ingredientIndex]?.trim();
      if (recipeName && ingredient) {
        if (!recipes[recipeName]) {
          recipes[recipeName] = { recipeName, ingredients: [] };
        }
        recipes[recipeName].ingredients.push(ingredient);
      }
    }
    if (Object.keys(recipes).length === 0) {
      setError("No valid recipes found in the uploaded file.");
      return [];
    }
    return Object.values(recipes);
  };

  const onDrop = (acceptedFile) => {
    // console.log("Accepted File:", acceptedFile);
    setError("");
    const file = acceptedFile[0];
    if (!file.name.endsWith(".xlsx")) {
      setError("Invalid file format, please upload .xlsx file only");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!sheet) {
        setError("Excel file does not contain any sheet.");
        return;
      }
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (!jsonData || jsonData.length === 0) {
        setError("uploaded file is empty.");
        return;
      }
      const extractedRecipes = extractRecipes(jsonData);
      if (extractedRecipes.length > 0) {
        onFileUpload(extractedRecipes);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xlsx",
  });

  return (
    <div className="upload-container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & Drop an Excel file here or click to upload</p>
      </div>
      {fileName && <p>Uploaded File: {fileName}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUpload;
