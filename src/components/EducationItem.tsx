import React, { useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Pencil, Trash2 } from "lucide-react";
import EducationForm from "./EducationForm";
import { DateRange } from "./DateRange";

const EducationItem = ({ info }: { info: Educations }) => {
  const { information, setInformations, fontOptions } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteItem = () => {
    const infoexpre = information.Educations?.filter((ex) => ex.id !== info.id);
    setInformations((prev) => ({
      ...prev,
      Educations: infoexpre,
    }));
  };
  return (
    <li
      key={info.id}
      className="nr-hover nr-item flex flex-col gap-2 relative"
    >
      <div className="nr-actions no-print -top-3 right-0">
        <EducationForm id={info.id} open={dialogOpen} setOpen={setDialogOpen} label={t.editor.item.edit}>
          <Pencil />
        </EducationForm>
        <button type="button" className="nr-action" data-danger aria-label={t.editor.item.remove} onClick={deleteItem}>
          <Trash2 />
        </button>
      </div>
      <div
        className={`w-full flex ${
          fontOptions?.diplayDateLine
            ? "items-center justify-between"
            : "flex-col"
        } `}
      >
        <h1 className="font-bold" style={{ fontSize: fontOptions.textSize }}>
          {info.title}
        </h1>
        <DateRange start={info.date_started} end={info.date_ending} />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span>{info.school}</span>|<span>{info.location}</span>
      </div>

      <div
        className="ProseMirror  flex flex-col gap-2 list-disc lpx-4"
        dangerouslySetInnerHTML={{ __html: info.subItems }}
      />
    </li>
  );
};

export default EducationItem;
