import React, { useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import SkillsForm from "./SkillsForm";

const SkillsItem = ({info}:{info:Skills}) => {
  const { information, setInformations,fontOptions } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const deleteItem = () => {
    const infoexpre = information.skills?.filter((ex) => ex.id !== info.id);
    setInformations((prev) => ({
      ...prev,
      skills: infoexpre,
    }));
  };
  return (
    <li
      key={info.id}
      style={{gap:fontOptions.SpaceInside}}
      className={`nr-hover nr-item flex ${fontOptions.displayOneLine?"justify-between items-center":"flex-col"}  relative `}
    >
      <div className="nr-actions no-print -top-3 right-0">
        <SkillsForm id={info.id} open={dialogOpen} setOpen={setDialogOpen}>
          <button type="button" className="nr-action" aria-label={t.editor.item.edit}><Pencil /></button>
        </SkillsForm>
        <button type="button" className="nr-action" data-danger aria-label={t.editor.item.remove} onClick={deleteItem}>
          <Trash2 />
        </button>
      </div>
      <h1 className="font-bold flex-[0.6] ">{info.skill}</h1>
      <div

        className="ProseMirror   flex flex-col flex-1 list-disc px-4"
        dangerouslySetInnerHTML={{ __html: info.subItems }}
      />
    </li>
  );
};

export default SkillsItem
