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
import { useSession } from "next-auth/react";
import {
  useState,
} from "react";
import { useDragDrop } from "./DraggableContext";



const CreateCV =() => {
 
  const [open,setOpen]=useState<boolean>(false)
  const [titleTempalte,setTitleTemplate]=useState<string>("");
   const { data: session, update, status } = useSession();
    const { information } = useDragDrop();
   const creteCsv = async () => {
    try {
      const result = await fetch("/api/CvtTmplates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session?.user.id,
          id_template: 1,
          title_template:titleTempalte,
          informations: information,
        }),
      });

      if (result.ok) {
        // Option 1: Refresh session to get updated user data
        const data = await result.json();

        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile");
      }
    } catch (error) {}
  };

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger  className="cursor-pointer bg-black text-white rounded-xl p-2">Create</DialogTrigger>
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
               type="text"
               placeholder="titre de votre template"
               value={titleTempalte}
               onChange={(e)=>{
                setTitleTemplate(e.target.value);
               }}
           
              />
            </div>
        </div>
        
        <DialogFooter className="py-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
          onClick={creteCsv}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCV
