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
    <main className="flex  w-full h-auto  md:h-screen  relative py-5 ">
      <SidebarApp />
      <div className="w-full h-full flex-col flex ">
        <div className="w-full flex items-center gap-3 justify-end"></div>


      {
         previw && <div className="w-full  py-3 flex lg:hidden justify-center ">
          {/* <TemplatePage/> */}
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>
      }
        <div className="w-full hidden py-3 lg:flex md:justify-center">
          {/* <TemplatePage/> */}
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>

        {
          !previw &&  <div className={`w-full flex lg:hidden items-center justify-between px-3`}>
          <AccordionDemo/>
        </div>
        }
       
      </div>
      <div className="fixed w-full py-2 bottom-0 bg-white  flex lg:hidden items-center justify-end">
                <Button 
                className="cursor-pointer"
                onClick={()=>{
                  setPreview((prev)=>{
                    return !prev
                  })
                }}>{previw?"info":"Preview"}</Button>
      </div>
    </main>
  );
};

export default MainTemplate;
