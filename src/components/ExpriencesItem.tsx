import React, { useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import ExprienceForm from "./ExprienceForm";
import { DateRange } from "./DateRange";

const ExpriencesItem = ({ info }: { info: Experience }) => {
  const { information, setInformations, fontOptions } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const deleteItem = () => {
    const infoexpre = information.Expriences?.filter((ex) => ex.id !== info.id);
    setInformations((prev) => ({
      ...prev,
      Expriences: infoexpre,
    }));
  };
  return (
    <li
      key={info.id}
      style={{ gap: fontOptions.SpaceInside }}
      className="nr-hover nr-item flex flex-col  px-2 relative "
    >
      <div className="nr-actions no-print -top-3 right-0">
        <ExprienceForm id={info.id} open={dialogOpen} setOpen={setDialogOpen} label={t.editor.item.edit}>
          <Pencil />
        </ExprienceForm>
        <button type="button" className="nr-action" data-danger aria-label={t.editor.item.remove} onClick={deleteItem}>
          <Trash2 />
        </button>
      </div>
      <div className={`w-full flex ${fontOptions?.diplayDateLine?"items-center justify-between":"flex-col"} `}>
        <h1
          style={{ fontSize: fontOptions.textSize }}
          className="outline-none pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
        >
          {info.title}
        </h1>
        <DateRange start={info.date_started} end={info.date_ending} />
      </div>

      <div className="flex items-center gap-2 px-2 text-xs text-gray-600">
        <span>{info.entrepriseName}</span>|<span>{info.location}</span>
      </div>

      <div
        className="ProseMirror flex flex-col gap-2 list-disc px-4"
        dangerouslySetInnerHTML={{ __html: info.subItems }}
      />
    </li>
  );
};

export default ExpriencesItem;
