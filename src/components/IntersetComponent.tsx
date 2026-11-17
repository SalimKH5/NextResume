import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Plus } from "lucide-react";
import IntersetDialog from "./IntersetDialog";
import IntersetItem from "./IntersetItem";
import { useSortableList } from "./editor/useSortableList";

const IntersetComponent = () => {
  const { information, fontOptions,scale } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  
  const computedTextSize = (fontOptions?.textSize ?? 14) 
  
  const computedTitleSize = (fontOptions?.titleSize?? 14)
  
  


  

  const listRef = useRef<HTMLUListElement>(null);
  
    useSortableList(listRef, "Intersets");


  return (
    <div
      className="nr-hover w-full relative flex flex-col gap-1 pr-3"
    >
      <div className="nr-actions nr-actions--add no-print -bottom-4 left-0">
        <IntersetDialog open={dialogOpen} setOpen={setDialogOpen}>
          <button type="button" className="nr-action" aria-label={t.editor.item.add}><Plus /><span>{t.editor.item.add}</span></button>
        </IntersetDialog>
      </div>
      <h3
            style={{color:fontOptions.secondColor,fontSize:computedTitleSize}} 
        className="outline-none pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
      >
        {information.titleInterests || t.resume.titles.titleInterests}
      </h3>
      <ul ref={listRef} id="hs-basic-usage-example-sortable" style={{fontSize:computedTextSize}}  className="w-full flex flex-col gap-1 px-3 text-xs">
        {information?.Intersets &&
          information.Intersets.map((Interset, index) => <IntersetItem key={Interset.id} Intersets={Interset} />)}
      </ul>
    </div>
  );
};

export default IntersetComponent;
