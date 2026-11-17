"use client";
import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import EducationItem from "./EducationItem";
import { Input } from "./ui/input";
import { Delete, Plus } from "lucide-react";
import EducationForm from "./EducationForm";
import { useSortableList } from "./editor/useSortableList";
import SectionTitle from "./SectionTitle";

const Educations = () => {
  const { information,fontOptions,setInformations } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);



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
      <SectionTitle field="titleEducations" />

      <ul ref={listRef} className="flex flex-col gap-4">
        
        {information?.Educations &&
          information?.Educations.map((info) => (
            <EducationItem key={info.id} info={info} />
          ))}
      </ul>
    </div>
  );
};

export default Educations;
