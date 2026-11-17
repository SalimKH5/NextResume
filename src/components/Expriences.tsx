"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Delete, Edit, Plus } from "lucide-react";

import ExpriencesItem from "./ExpriencesItem";
import ExprienceForm from "./ExprienceForm";
import { useSortableList } from "./editor/useSortableList";

const Expriences = () => {
  const { information, setInformations,fontOptions,scale } = useDragDrop();
  const { t } = useI18n();

  const [EditTitle, setEditTitle] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);


  const listRef = useRef<HTMLUListElement>(null);
  
    useSortableList(listRef, "Expriences");
  


  // 🔁 Detect outside click to disable edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setEditTitle(false);
      }
    };

    if (EditTitle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [EditTitle]);

const computedTitleSize = (fontOptions?.titleSize ?? 14);



  return (
    <div
      style={{gap:fontOptions.SpaceInside}}
      className="nr-hover w-full relative flex flex-col "
    >
      <div className="nr-actions nr-actions--add no-print -bottom-4 left-0">
        <ExprienceForm open={dialogOpen} setOpen={setDialogOpen} label={t.editor.item.add}>
          <Plus /><span>{t.editor.item.add}</span>
        </ExprienceForm>
      </div>

      {EditTitle ? (
        <Input
          ref={inputRef}
          type="text"
          className="text-blue-600 outline-none cursor-pointer pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
          
           value={information.titleExprience}
          onChange={(e) => {
            const value = e.target.value;
            setInformations((prev) => ({
              ...prev,
              titleExprience: value,
            }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditTitle(false);
            }
          }}
        />
      ) : (
        <h1
          onClick={() => {
            setEditTitle(true);
          }}
          style={{color:fontOptions.secondColor,fontSize:computedTitleSize}} 
          className=" border-b-2 border-current cursor-pointer pl-0 font-bold   focus:border-black focus-visible:ring-0 w-full"
        >
          {information.titleExprience}
        </h1>
      )}

      <ul ref={listRef} id="hs-basic-usage-example-sortable"  className="flex flex-col gap-4">
        {information?.Expriences &&
          information?.Expriences.map((info) => (
            <ExpriencesItem key={info.id} info={info} />
          ))}
      </ul>
    </div>
  );
};

export default Expriences;
