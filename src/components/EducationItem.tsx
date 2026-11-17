import React, { useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { Button } from "./ui/button";
import { Delete, Edit, Plus } from "lucide-react";
import EducationForm from "./EducationForm";
import { DateRange } from "./DateRange";

const EducationItem = ({ info }: { info: Educations }) => {
  const [hover, setHover] = useState<boolean>(false);
  const { information, setInformations, fontOptions } = useDragDrop();
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
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      key={info.id}
      className="flex flex-col gap-2 relative hover:bg-[#1717171b]"
    >
      {hover && (
        <div className="absolute -right-1 flex items-center gap-3">
          <Button onClick={deleteItem}>
            <Delete />
          </Button>
          <EducationForm id={info.id} open={dialogOpen} setOpen={setDialogOpen}>
            <Edit size={16} />
          </EducationForm>
        </div>
      )}
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
