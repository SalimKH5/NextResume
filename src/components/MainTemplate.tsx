"use client";
import { useDragDrop } from "@/components/DraggableContext";
import SidebarApp from "@/components/SidebarApp";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { AccordionDemo } from "./ui/AccordioDemo";
import { Button } from "./ui/button";

const MainTemplate = ({ info }: { info?: GetTypeInformation }) => {
  const { SelectedTemplate, containerRef, information, setInformations } =
    useDragDrop();

  useEffect(() => {
    if (!info) {
      return;
    }
    setInformations(info.informations!);
  }, [info]);

  const { data: session } = useSession();
  useEffect(() => {
    const handleUpdateInformation = async () => {
      try {
        const result = await fetch("/api/CvtTmplates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session?.user?.id,
            id_template: info?._id,
            informations: information,
            title_template: information?.title,
          }),
        });

        if (result.ok) {
          console.log("Update successful");
        } else {
          console.log("Update failed", await result.json());
        }
      } catch (error) {
        console.log("Error occurred", error);
      }
    };

    if (information && session?.user?.id) {
      handleUpdateInformation();
    }
  }, [information, session?.user?.id, info?._id]);

  const [previw,setPreview]=useState<boolean>(false);



  return (
    <main className="flex w-full h-auto  md:h-screen  relative py-5 ">
      <SidebarApp />
      <div className="w-full h-full flex-col flex py-6 px-2">
        <div className="w-full flex items-center gap-3 justify-end"></div>


      {
         previw && <div className="w-full  py-3 flex md:hidden justify-center  scale-x-[0.65] pointer-events-none scale-y-[0.95] ">
          {/* <TemplatePage/> */}
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>
      }
        <div className="w-full hidden py-3 md:flex justify-center">
          {/* <TemplatePage/> */}
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>

        {
          !previw &&  <div className={`w-full flex md:hidden items-center justify-between px-3`}>
          <AccordionDemo/>
        </div>
        }
       
      </div>
      <div className="fixed bottom-0 bg-white w-full py-8 flex md:hidden items-center justify-end">
                <Button onClick={()=>{
                  setPreview((prev)=>{
                    return true
                  })
                }}>Preview</Button>
      </div>
    </main>
  );
};

export default MainTemplate;
