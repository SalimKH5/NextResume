import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import SkillsItem from "./SkillsItem";
import SkillsForm from "./SkillsForm";
import { useSortableList } from "./editor/useSortableList";
import SectionTitle from "./SectionTitle";

const Skills = () => {
  const { information, fontOptions, setInformations ,scale} = useDragDrop();
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);

  useSortableList(listRef, "skills");


  const computedTitleSize = (fontOptions?.titleSize ?? 14);



  return (
    <div
      className="nr-hover w-full relative flex flex-col "
    >
      <div className="nr-actions nr-actions--add no-print -bottom-4 left-0">
        <SkillsForm open={dialogOpen} setOpen={setDialogOpen}>
          <button type="button" className="nr-action" aria-label={t.editor.item.add}><Plus /><span>{t.editor.item.add}</span></button>
        </SkillsForm>
      </div>
      <SectionTitle field="titleSkills" />

      <ul
        ref={listRef}
       
        className={`flex flex-col gap-${fontOptions.SpaceInside}`}
      >
        {information?.skills &&
          information?.skills.map((info) => (
            <SkillsItem info={info} key={info.id} />
          ))}
      </ul>
    </div>
  );
};

export default Skills;
