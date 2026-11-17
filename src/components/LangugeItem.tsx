import React, { useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { ItemMoveButtons } from "./editor/ItemMoveButtons";
import LangugeDialog from "./LangugeDialog";
import { Pencil, Trash2 } from "lucide-react";

const LangugeItem = ({ language }: { language: Languge }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { information, setInformations,fontOptions } = useDragDrop();
  const { t } = useI18n();

  const deleteItem = () => {

    const infoexpre = information.Languages?.filter(
      (ex) => ex.id !== language.id
    );

    setInformations((prev) => ({
      ...prev,
      Languages: infoexpre,
    }));
  };

  return (
    <li
      key={language.id}
       className={`nr-hover nr-item flex ${fontOptions.diplayLanguageLine?"justify-between items-center gap-1":"flex-col"}  relative `}
    >
      <div className="nr-actions no-print -top-3 right-0">
        <ItemMoveButtons field="Languages" id={language.id} />
        <LangugeDialog id={language.id} open={dialogOpen} setOpen={setDialogOpen}>
          <button type="button" className="nr-action" aria-label={t.editor.item.edit}><Pencil /></button>
        </LangugeDialog>
        <button type="button" className="nr-action" data-danger aria-label={t.editor.item.remove} onClick={deleteItem}>
          <Trash2 />
        </button>
      </div>
      <span className="font-bold">{language.label}</span>
      {language.valuebar ? (
        <div className="w-full bg-gray-600 h-[4px] rounded">
          <div
            style={{ width: `${language.valuebar}%`,background:fontOptions.primaryColor }}
            className=" h-full rounded"
          ></div>
        </div>
      ) : (
        <div className="w-full pl-3">
          <div dangerouslySetInnerHTML={{ __html: language.value }} />
        </div>
      )}
    </li>
  );
};

export default LangugeItem;
