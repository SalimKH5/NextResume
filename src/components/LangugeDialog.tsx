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
const LangugeDialog = ({ children, open, setOpen, id }: Props) => {
  const { information, setInformations } = useDragDrop();
  const [bareValue, setBarValue] = useState<boolean>(false);
  const [item, setItem] = useState<Languge>(() => {
    if (id) {
      const existing = information.Languages?.find((prev) => prev.id === id);
      if (existing) return existing;
    }
    return {
      id: information.Languages?.length ?? 0,
      label: "",
      value: "",
      valuebar: undefined,
    };
  });

  const handleItems = (item: Languge | undefined) => {
    if (!item) return; // Prevent inserting undefined

    if (id && information?.Languages) {
      const updatedItems = information.Languages.map((exp) =>
        exp.id === id ? item : exp
      );

      setInformations((prev) => ({
        ...prev,
        Languages: updatedItems,
      }));
    } else {
      setInformations((prev) => ({
        ...prev,
        Languages: [item, ...(prev.Languages || [])],
      }));
    }

    setOpen(false);
  };

  useEffect(() => {
   if(item.valuebar){
    setBarValue(true);
   }
  },[item]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px] flex flex-col gap-3">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="username-1">Choisir une langue</Label>
            <Input
              value={item?.label}
              onChange={(e) =>
                setItem((prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col  gap-1 ">
            <div className="flex items-center gap-3">
              <Label htmlFor="username-1">
                Quel est votre niveau ? Afficher une barre de compétence
                opérationnelle
              </Label>
              <Input
                checked={bareValue}
                onChange={(e) => {
                  setBarValue(e.target.checked);
                  if(!e.target.checked){
                   setItem((prev) => ({
                    ...prev,
                    valuebar: undefined,
                  }))
                  }
                  
                }}
                className="w-5 h-5"
                type="checkbox"
              />
            </div>
            {bareValue && (
              <Input
                className="w-1/2"
                type="range"
                value={item?.valuebar}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    valuebar: parseInt(e.target.value),
                  }))
                }
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="username-1">Details</Label>
             <TipTapEditor
                        value={item.value}
                        onChange={(e) => {
                          setItem((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }));
                        }}
                      />
          </div>
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

export default LangugeDialog;
