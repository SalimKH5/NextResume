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
const IntersetDialog = ({ children, open, setOpen, id }: Props) => {
  const { information, setInformations } = useDragDrop();
  const [item, setItem] = useState<IntersetType>(() => {
    if (id) {
      const existing = information.Intersets?.find((prev) => prev.id === id);
      if (existing) return existing;
    }
    return {
      id: information.Intersets?.length ?? 0,
      label: "",
    };
  });

  const handleItems = (item: IntersetType | undefined) => {
    if (!item) return; // Prevent inserting undefined

    if (id && information?.Intersets) {
      const updatedItems = information.Intersets.map((exp) =>
        exp.id === id ? item : exp
      );

      setInformations((prev) => ({
        ...prev,
        Intersets: updatedItems,
      }));
    } else {
      setInformations((prev) => ({
        ...prev,
        Intersets: [item, ...(prev.Intersets || [])],
      }));
    }

    setOpen(false);
  };

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
            <Label htmlFor="username-1">Centre d&apos;intérêt</Label>
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
          <div className="flex flex-1 flex-col gap-1">
            <Label htmlFor="username-1">Details</Label>
            <TipTapEditor
              value={item?.value?item?.value:""}
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

export default IntersetDialog;
