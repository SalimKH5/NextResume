"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Delete, Edit, Plus } from "lucide-react";

import ExpriencesItem from "./ExpriencesItem";
import ExprienceForm from "./ExprienceForm";
import { useSortableList } from "./editor/useSortableList";
import SectionTitle from "./SectionTitle";
import { SectionExample } from "./editor/SectionExample";

const Expriences = () => {
  const { information, setInformations,fontOptions,scale } = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);


  const listRef = useRef<HTMLUListElement>(null);
  
    useSortableList(listRef, "Expriences");

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

      <SectionTitle field="titleExprience" />

      <ul ref={listRef}  className="flex flex-col gap-4">
        {information?.Expriences &&
          information?.Expriences.map((info) => (
            <ExpriencesItem key={info.id} info={info} />
          ))}
      </ul>
      {!information?.Expriences?.length && <SectionExample kind="experience" />}
    </div>
  );
};

export default Expriences;
