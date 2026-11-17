import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import LangugeDialog from "./LangugeDialog";
import { Edit, Plus } from "lucide-react";
import LangugeItem from "./LangugeItem";
import { useSortableList } from "./editor/useSortableList";
import SectionTitle from "./SectionTitle";
import { Input } from "./ui/input";
const Languages = () => {
  const { information,setInformations,fontOptions ,scale} = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const listRef = useRef<HTMLUListElement>(null);

  useSortableList(listRef, "Languages");


  
  
  const computedTitleSize = (fontOptions?.titleSize?? 14) * scale!;



  return (
    <div 
      style={{gap:fontOptions.SpaceInside}} 

    className="nr-hover w-full relative flex flex-col gap-1 pr-3">
         <div className="nr-actions nr-actions--add no-print -bottom-4 left-0">
        <LangugeDialog open={dialogOpen} setOpen={setDialogOpen}>
          <button type="button" className="nr-action" aria-label={t.editor.item.add}><Plus /><span>{t.editor.item.add}</span></button>
        </LangugeDialog>
      </div>
    <SectionTitle field="titleLanguages" />

     
      <ul ref={listRef} className={`w-full flex flex-col gap-${fontOptions.SpaceInside} px-3 text-xs`}>
        {information?.Languages &&
          information.Languages.map((language, index) => (
            <LangugeItem language={language} key={language.id}/>
          ))}
      </ul>
    </div>
  );
};

export default Languages;
