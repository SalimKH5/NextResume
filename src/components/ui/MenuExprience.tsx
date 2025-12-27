"use client"
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVerticalIcon, Plus } from "lucide-react";
import { Button } from "./button";
import ExprienceForm from "../ExprienceForm";

const MenuExprience = () => {
    const [dialogOpen,setDialogOpen]=useState<boolean>(false)
  return (
   <ExprienceForm
                open={dialogOpen}
                setOpen={setDialogOpen}
              >
                <Plus className="cursor-pointer" size={16} />
 </ExprienceForm>
  );
};

export default MenuExprience;
