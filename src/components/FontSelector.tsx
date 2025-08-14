"use client"; // if you're using App Router

import React from "react";
import { useDragDrop } from "./DraggableContext";


export default function FontSelector() {
  const {fontOptions,setFontOptions}=useDragDrop();
  
const fontOption = [
  "Arial, sans-serif",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Comic Sans MS",
  "Trebuchet MS",
  "Impact",
];



  return (
    <select 
    value={fontOptions.font}
    onChange={(e)=>{
      setFontOptions((prev)=>({
        ...prev,
        font:e.target.value
      }))
    }}
    className="p-2 border rounded">
      {fontOption.map((font:string) => (
        <option
          key={font}
          value={font}
          style={{ fontFamily: font }}

        >
          {font}
        </option>
      ))}
    </select>
  );

}