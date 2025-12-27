import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import TipTapEditor from "./TipTapEditor";

type Props = {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id?: number;
};
const EducationForm = ({ children, open, setOpen, id }: Props) => {
  const { information, setInformations } = useDragDrop();

  const [item, setItem] = useState<Educations>(() => {
    if (id) {
      const existing = information.Educations?.find((prev) => prev.id === id);
      if (existing) return existing;
    }
    return {
      id: information.Educations?.length
        ? information.Educations?.length + 1
        : 1,
      title: "",
      date_started: "", // default to now
      date_ending: "", // or ""
      location: "",
      subItems: "",
      school: "",
    };
  });

  const handleItems = (item: Educations | undefined) => {
    if (!item) return; // Prevent inserting undefined

    if (id && information?.Educations) {
      const updatedItems = information.Educations.map((exp) =>
        exp.id === id ? item : exp
      );

      setInformations((prev) => ({
        ...prev,
        Educations: updatedItems,
      }));
    } else {
      setInformations((prev) => ({
        ...prev,
        Educations: [item, ...(prev.Educations || [])],
      }));
    }

    setOpen(false);
  };

  const [dateState, setDateState] = useState<boolean>(
    item?.date_ending == "currently" ? true : false
  );
  return (
    <div>
      <Button
        className="cursor-pointer bg-white text-black hover:text-white"
        onClick={() => {
          setOpen((prev) => {
            return !prev;
          });
        }}
      >
        {children}
      </Button>
      {open && (
        <div className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-[625px] bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="mb-3">
              <h1 className="text-xl font-semibold">Edit profile</h1>
              <p className="text-sm text-gray-600">
                Make changes to your profile here. Click save when you&apos;re
                done.
              </p>
            </div>

            {/* Body */}
            <div className="w-full grid gap-4">
              <div className="w-full flex flex-wrap items-center gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="month"
                    className="w-full"
                    required
                    value={item.date_started}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      setItem((prev) => ({
                        ...prev,
                        date_started: rawValue,
                        date_ending: dateState
                          ? "currently"
                          : prev?.date_ending,
                      }));
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    disabled={dateState}
                    type="month"
                    required
                    className="w-full"
                    value={item?.date_ending ? item.date_ending : ""}
                    onChange={(e) =>
                      setItem((prev) => ({
                        ...prev,
                        date_ending: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-[0.5] flex-col gap-1">
                  <Label htmlFor="isCurrent">En cours</Label>
                  <Input
                    type="checkbox"
                    className="size-5"
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
                <Label htmlFor="diploma">Diploma Name</Label>
                <Input
                  type="text"
                  value={item?.title}
                  onChange={(e) =>
                    setItem((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-full flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="school">School</Label>
                  <Input
                    value={item?.school}
                    onChange={(e) =>
                      setItem((prev) => ({
                        ...prev,
                        school: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="location">Address</Label>
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

            {/* Comments */}
            <div className="mt-4">
              <Label htmlFor="comments">Comments</Label>
              <TipTapEditor
                value={item.subItems}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    subItems: e.target.value,
                  }))
                }
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-5">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button onClick={() => handleItems(item)}>Save changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EducationForm;
