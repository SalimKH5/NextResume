import React, { useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import LangugeDialog from "./LangugeDialog";
import { Pencil, Trash2 } from "lucide-react";
import IntersetDialog from "./IntersetDialog";
const IntersetItem = ({ Intersets }: { Intersets: IntersetType }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { information, setInformations, fontOptions } = useDragDrop();
  const { t } = useI18n();

  const deleteItem = () => {
  
    const infoexpre = information.Intersets?.filter(
      (ex) => ex.id !== Intersets.id
    );
 
    setInformations((prev) => ({
      ...prev,
      Intersets: infoexpre,
    }));
  };

  
  return (
    <li
      key={Intersets.id}
      className="nr-hover nr-item w-full hover:bg-[#0303034c] flex flex-col relative gap-2"
    >
      <div className="nr-actions no-print -top-3 right-0">
        <IntersetDialog id={Intersets.id} open={dialogOpen} setOpen={setDialogOpen}>
          <button type="button" className="nr-action" aria-label={t.editor.item.edit}><Pencil /></button>
        </IntersetDialog>
        <button type="button" className="nr-action" data-danger aria-label={t.editor.item.remove} onClick={deleteItem}>
          <Trash2 />
        </button>
      </div>
      <span className="font-bold">{Intersets.label}</span>
      <div className="w-full pl-3">
        {
            Intersets.value && <div className="" dangerouslySetInnerHTML={{ __html: Intersets.value }} />
        }
        
      </div>
    </li>
  );
};

export default IntersetItem;
