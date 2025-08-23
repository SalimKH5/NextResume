"use client";
import { useDragDrop } from "@/components/DraggableContext";
import SidebarApp from "@/components/SidebarApp";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

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


  console.log({SelectedTemplate:SelectedTemplate.name});

  return (
    <main className="flex w-full h-screen  ">
      <SidebarApp />
      <div className="w-full h-full flex-col flex py-6 px-2">
        <div className="w-full flex items-center gap-3 justify-end"></div>

        <div className="w-full hidden py-3 sm:flex justify-center">
          {/* <TemplatePage/> */}
          {containerRef && <SelectedTemplate containerRef={containerRef} />}
        </div>
        <div className="w-full flex sm:hidden items-center justify-between px-3">
          <div className="flex items-center gap-3 flex-col bg-gray-300">
            <img src="/profile.jpg" alt="" width={60} height={60} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainTemplate;
