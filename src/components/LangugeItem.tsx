import React, { useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import LangugeDialog from "./LangugeDialog";
import { Delete, Edit, Plus } from "lucide-react";
import { Button } from "./ui/button";

const LangugeItem = ({ language }: { language: Languge }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverCreate, setHoverCreate] = useState(false);
  const { information, setInformations,fontOptions } = useDragDrop();

  const deleteItem = () => {

    const infoexpre = information.Languages?.filter(
      (ex) => ex.id !== language.id
    );

    setInformations((prev) => ({
      ...prev,
      Languages: infoexpre,
    }));
  };


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
      }, 200);
    }
  };

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={language.id}
       className={`flex ${fontOptions.diplayLanguageLine?"justify-between items-center gap-1":"flex-col"}  relative `}
    >
      {hoverCreate && (
        <div className="absolute -right-2 flex items-center   bg-white text-black cursor-pointer rounded-xl">
          <Button  className="bg-white text-black " onClick={deleteItem}>
            <Delete size={12} />
          </Button>
          <LangugeDialog
            id={language.id}
            open={dialogOpen}
            setOpen={setDialogOpen}
          >
            <Edit size={12} />
          </LangugeDialog>
        </div>
      )}
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
