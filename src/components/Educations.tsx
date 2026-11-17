"use client";
import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import EducationItem from "./EducationItem";
import { Input } from "./ui/input";
import { Delete, Plus } from "lucide-react";
import EducationForm from "./EducationForm";
import { useSortableList } from "./editor/useSortableList";

const Educations = () => {
  const { information,fontOptions,setInformations } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
   const [EditTitle, setEditTitle] = useState<boolean>(false);
   
   const inputRef = useRef<HTMLInputElement>(null);
  
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



  const listRef = useRef<HTMLUListElement>(null);
  
    useSortableList(listRef, "Educations");

  return (
    <div
      style={{gap:fontOptions.SpaceInside}}
      className="nr-hover w-full flex relative flex-col gap-3"
    >
       <div className="nr-actions nr-actions--add no-print -bottom-4 left-0">
        <EducationForm open={dialogOpen} setOpen={setDialogOpen} label={t.editor.item.add}>
          <Plus /><span>{t.editor.item.add}</span>
        </EducationForm>
      </div>
      {EditTitle ? (
        <Input
          ref={inputRef}
          type="text"
          className="text-blue-600 outline-none pl-0 cursor-pointer font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
            
           value={information.titleEducations}
          onChange={(e) => {
            const value = e.target.value;
            setInformations((prev) => ({
              ...prev,
              titleEducations: value,
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
           style={{color:fontOptions.secondColor,fontSize:fontOptions.titleSize}} 
           className="w-full border-b-2 border-current pl-0 font-bold cursor-pointer  focus:border-black focus-visible:ring-0 "
        >
          {information.titleEducations}
        </h1>
      )}

      <ul ref={listRef} id="hs-basic-usage-example-sortable" className="flex flex-col gap-4">
        
        {information?.Educations &&
          information?.Educations.map((info) => (
            <EducationItem key={info.id} info={info} />
          ))}
      </ul>
    </div>
  );
};

export default Educations;
