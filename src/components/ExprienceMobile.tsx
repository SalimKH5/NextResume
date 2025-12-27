"use client";
import { Edit, Expand } from "lucide-react";
import React, { useState } from "react";
import ExprienceForm from "./ExprienceForm";
import EducationForm from "./EducationForm";

type Props = {
  ex: Experience  | Educations ;
  type:string;
};

const ExprienceMobile = ({ ex,type }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex items-center relative justify-between cursor-pointer bg-[#fefefe] px-3">
      <Expand />
      <p>{ex.title}</p>
      <div className="flex z-50 right-1 shadow-2xs items-center gap-2">
        {type === "experience" ? (
          <ExprienceForm id={ex.id} open={dialogOpen} setOpen={setDialogOpen}>
            <Edit className="cursor-pointer" size={16} />
          </ExprienceForm>
        ) : (
          <EducationForm id={ex.id} open={dialogOpen} setOpen={setDialogOpen}>
            <Edit className="cursor-pointer" size={16} />
          </EducationForm>
        )}
      </div>
    </div>
  );
};

export default ExprienceMobile;
