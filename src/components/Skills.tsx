import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import SkillsItem from "./SkillsItem";
import SkillsForm from "./SkillsForm";
import Sortable from "sortablejs";

const Skills = () => {
  const { information, fontOptions, setInformations } = useDragDrop();

  const [EditTitle, setEditTitle] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverCreate, setHoverCreate] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleMouseEnter = () => {
    if (!dialogOpen) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setHoverCreate(true);
    }
  };

  const handleMouseLeave = () => {
    if (!dialogOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoverCreate(false);
      }, 300);
    }
  };

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

  useEffect(() => {
    if (listRef.current) {
      Sortable.create(listRef.current, {
        animation: 150,
        dragClass: "rounded-none!",
      });
    }
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full relative flex flex-col "
    >
      {hoverCreate && (
        <div className="flex z-50 absolute -top-2 shadow-2xs bg-white text-black items-center gap-2">
          <SkillsForm open={dialogOpen} setOpen={setDialogOpen}>
            <Plus size={16} />
          </SkillsForm>
        </div>
      )}
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
            fontSize: fontOptions.titleSize,
          }}
          className="border-b-2 border-black cursor-pointer pl-0 font-bold   focus:border-black focus-visible:ring-0 w-full"
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
