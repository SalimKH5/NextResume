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

const ExprienceForm = ({ children, open, setOpen, id }: Props) => {
  const { information, setInformations } = useDragDrop();

  const [item, setItem] = useState<Experience>(() => {
    if (id) {
      const existing = information.Expriences?.find((prev) => prev.id === id);
      if (existing) return existing;
    }
    return {
      id: information.Expriences?.length ?information.Expriences?.length+1: 1,
      title: "",
      date_started: "",
      date_ending: "",
      location: "",
      subItems: "",
      entrepriseName: "",
    };
  });

  const handleItems = (item: Experience | undefined) => {
    if (!item) return; // Prevent inserting undefined

    if (id && information?.Expriences) {
      const updatedItems = information.Expriences.map((exp) =>
        exp.id === id ? item : exp
      );

      setInformations((prev) => ({
        ...prev,
        Expriences: updatedItems,
      }));
    } else {
      setInformations((prev) => ({
        ...prev,
        Expriences: [item, ...(prev.Expriences || [])],
      }));
    }

    setOpen(false);
  };

 

  const [dateState, setDateState] = useState<boolean>(
    item?.date_ending == "currently" ? true : false
  );
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
        <div className="grid gap-4">
          <div className="w-full flex items-center  gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="username-1">Date de début</Label>
              <Input
                id="startDate"
                type="month"
                className="w-full"
                required
                value={
                  item?.date_started // "2025-06"
                    ? item.date_started
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value; // "2025-06"
                  const [year, month] = rawValue.split("-");
                  
                 
                  setItem((prev) => ({
                    ...prev,
                    date_started: rawValue,
                    date_ending: dateState ? "currently" : prev?.date_ending,
                  }));
                }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="username-1">Date de fin</Label>
              <Input
                disabled={dateState}
                type="month"
                required
                className="w-full"
                value={
                  item?.date_ending // "2025-06"
                    ? item.date_ending
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value; // "2025-06"
                  setItem((prev) => ({
                    ...prev,
                    date_ending: rawValue,
                  }));
                }}
              />
            </div>
            <div className="flex flex-[0.5] flex-col gap-1">
              <Label htmlFor="username-1">Date de fin</Label>
              <Input
                type="checkbox"
                className="size-5"
                required
                checked={dateState}
                onChange={() => {
                  setDateState((prev) => !prev);
                  setItem((prev) => ({
                    ...prev,
                    date_ending: "currently",
                  }));
                }}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name-1">Role</Label>
            <Input
              type="text"
              value={item?.title}
              onChange={(e) => {
                setItem((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
            />
          </div>
          <div className="w-full flex items-center  gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="username-1">Entreprise</Label>
              <Input
                value={item?.entrepriseName}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    entrepriseName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="username-1">Address</Label>
              <Input
                value={item?.location}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <Label htmlFor="username-1">Comments</Label>
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

export default ExprienceForm;
