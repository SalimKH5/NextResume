import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import SkillsItem from "./SkillsItem";
import SkillsForm from "./SkillsForm";
import { useSortableList } from "./editor/useSortableList";

const Skills = () => {
  const { information, fontOptions, setInformations ,scale} = useDragDrop();
  const { t } = useI18n();

  const [EditTitle, setEditTitle] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // 🔁 Detect outside click to disable edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setEditTitle(false);
      }
    };

    if (EditTitle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [EditTitle]);

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
      {EditTitle ? (
        <Input
          ref={inputRef}
          type="text"
          style={{ color: fontOptions.secondColor }}
          className="outline-none pl-0 font-bold text-xl cursor-pointer border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
          value={information.titleSkills}
          onChange={(e) => {
            const value = e.target.value;
            setInformations((prev) => ({
              ...prev,
              titleSkills: value,
            }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditTitle(false);
            }
          }}
        />
      ) : (
        <h1
          onClick={() => {
            setEditTitle(true);
          }}
          style={{
            color: fontOptions.secondColor,
            fontSize:computedTitleSize,
          }}
          className="border-b-2 border-current cursor-pointer pl-0 font-bold   focus:border-black focus-visible:ring-0 w-full"
        >
          {information.titleSkills}
        </h1>
      )}

      <ul
        ref={listRef}
        id="hs-basic-usage-example-sortable"
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
