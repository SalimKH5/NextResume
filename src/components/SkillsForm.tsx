import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useDragDrop } from "./DraggableContext";
import TipTapEditor from "./TipTapEditor";
type Props = {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
};
const SkillsForm =({ children, open, setOpen, id }: Props) => {
 const { information, setInformations } = useDragDrop();

  const [item, setItem] = useState<Skills>(() => {
    if (id) {
      const existing = information.skills?.find((prev) => prev.id === id);
      if (existing) return existing;
    }
    return {
      id: information.skills?.length ?information.skills?.length+1: 1,
      skill:"",
      subItems:"",  
    };
  });

  const handleItems = (item: Skills | undefined) => {
    if (!item) return; // Prevent inserting undefined

    if (id && information?.skills) {
      const updatedItems = information.skills.map((exp) =>
        exp.id === id ? item : exp
      );

      setInformations((prev) => ({
        ...prev,
        skills: updatedItems,
      }));
    } else {
      setInformations((prev) => ({
        ...prev,
        skills: [item, ...(prev.skills || [])],
      }));
    }

    setOpen(false);
  };



  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px] flex flex-col gap-3">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
          <div className="w-full flex items-center  gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="username-1">Title</Label>
              <Input
                value={item?.skill}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    skill: e.target.value,
                  }))
                }
              />
            </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="username-1">Detail</Label>
          <TipTapEditor
            value={item.subItems}
            onChange={(e) => {
              setItem((prev) => ({
                ...prev,
                subItems: e.target.value,
              }));
            }}
          />
        </div>
        <DialogFooter className="py-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              handleItems(item);
            }}
          >
            {" "}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsForm
