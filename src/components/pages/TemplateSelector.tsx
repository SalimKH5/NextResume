"use client";
import React from "react";
import TemplatesOne from "./TemplatesOne";
import TemplatesTwo from "./TemplatesTwo";
import { useDragDrop } from "../DraggableContext";
import Image from "next/image";
import Educations from "../Educations";
import Expriences from "../Expriences";
import Languages from "../Languges";
import Skills from "../Skills";
import IntersetComponent from "../IntersetComponent";
import TemplatesThird from "./TemplatesThird";

type TemplateType = {
  id:string;
  img: string;
  label: string;
  template: TemplateComponentType;
  style: OptionsStyle;
  Items: DroppedItemsMap;
};

const TemplateSelector = () => {
  const templates: TemplateType[] = [
    {
      id:"template1",
      img: "template1.png",
      label: "Template 1",
      template: TemplatesOne,
      style: {
        BackgroundColor: "#333333",
        primaryColor: "#FFFFFF",
        secondColor: "#479099",
        font: "Arial, sans-serif",
        textSize: 14,
        titleSize: 20,
        fontweight: 700,
        paddingHorizontal: 3,
        paddingVertical: 2,
        maxContentWidth: 10,
        SpaceContent: 20,
        SpaceInside: 10,
      },
      Items: {
        "zone-B": {
          1: [
            {
              id: "education-1",
              component: <Educations />,
            },
            {
              id: "WorkExpricence",
              component: <Expriences />,
            },
          ],
        },
        "zone-A": {
          1: [
            {
              id: "Languges-1",
              component: <Languages />,
            },
            {
              id: "Skills-2",
              component: <Skills />,
            },
            {
              id: "Interst-2",
              component: <IntersetComponent />,
            },
          ],
        },
      },
    },
    {
       id:"template2",
      img: "template2.png",
      label: "Template 2",
      template: TemplatesTwo,
      style: {
        BackgroundColor: "#333333",
        primaryColor: "#000000",
        secondColor: "#479099",
        font: "Arial, sans-serif",
        textSize: 14,
        titleSize: 20,
        fontweight: 700,
        paddingHorizontal: 3,
        paddingVertical: 2,
        maxContentWidth: 10,
        SpaceContent: 20,
        SpaceInside: 10,
      },
      Items: {
        "zone-B": {
          1: [
          {
            id: "education-1",
            component: <Educations />,
          },
          {
            id: "WorkExpricence",
            component: <Expriences />,
          },
          {
            id: "Skills-2",
            component: <Skills />,
          },
        ],
      },
        "zone-A": {
          1: [
          {
            id: "Languges-1",
            component: <Languages />,
          },

          {
            id: "Interst-2",
            component: <IntersetComponent />,
          },
        ],
      }
      },
    },
    {
       id:"Template3",
      img: "template2.png",
      label: "Template 3",
      template: TemplatesThird,
      style: {
        BackgroundColor: "#333333",
        primaryColor: "#000000",
        secondColor: "#479099",
        font: "Arial, sans-serif",
        textSize: 14,
        titleSize: 20,
        fontweight: 700,
        paddingHorizontal: 6,
        paddingVertical: 2,
        maxContentWidth: 10,
        SpaceContent: 10,
        SpaceInside: 10,
        diplayDateLine:true,
        diplayLanguageLine:true,
        displayOneLine:true,
      },
      Items: {
        "zone-A": {
          1: [
          {
            id: "Skills-1",
            component: <Skills />,
          },
           {
            id: "WorkExpricence",
            component: <Expriences />,
          },
          {
            id: "education-1",
            component: <Educations />,
          },
           {
              id: "Languges-1",
              component: <Languages />,
            },
         
          {
            id: "Interst-2",
            component: <IntersetComponent />,
          },
        ],
      }
      },
    },
  ];

  const { setSelectedTemplate, setFontOptions, setDroppedItems } =
    useDragDrop();

  const handleTemplateSelect = (Component: TemplateType) => {
    setSelectedTemplate(() => Component.template);
    setFontOptions(() => Component.style);
    setDroppedItems(() => Component.Items);
  };
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 gap-6">
        {templates.map((template, index) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className="w-full cursor-pointer flex flex-col gap-2 hover:scale-110 text-center transition-transform"
          >
            <img
              src={template.img}
              alt={template.label}
              className="w-full h-44 object-fill"
            />
            <span>{template.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
