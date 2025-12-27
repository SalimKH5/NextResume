"use client"
import React, { useState } from "react";
import EducationForm from "./EducationForm";
import { Plus } from "lucide-react";

const MenuEducations = () => {
   const [dialogOpen,setDialogOpen]=useState<boolean>(false)
  return (
   <EducationForm
                open={dialogOpen}
                setOpen={setDialogOpen}
              >
                <Plus className="cursor-pointer" size={16} />
 </EducationForm>
  );
}

export default MenuEducations
