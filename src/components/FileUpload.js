"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

const FileUpload = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");



  const extractRecipes = (data) => {
    const recipes = {};
    for (let i = 1; i < data.length; i++) {
      const recipeName = data[i][0];
      const ingredient = data[i][1];

      if (recipeName && ingredient) {
        if (!recipes[recipeName]) {
          recipes[recipeName] = { recipeName, ingredients: [] };
        }
        recipes[recipeName].ingredients.push(ingredient);
      }
    }
    console.log("/.... recipes", recipes)
    return Object.values(recipes);
  };

  const onDrop = (acceptedFile) => {
    console.log("acceptedFile", acceptedFile)
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
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const extractedRecipes = extractRecipes(jsonData);
      onFileUpload(extractedRecipes);
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
