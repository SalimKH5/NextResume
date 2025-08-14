"use client"
import { useDragDrop } from "@/components/DraggableContext";
import SidebarApp from "@/components/SidebarApp";

  
const MainTemplate = () => {
  const { SelectedTemplate, containerRef } = useDragDrop();




  return (
   <main className="flex w-full h-screen  ">
         <SidebarApp />
         <div className="w-full h-full flex-col flex py-6">
           <div className="w-full flex items-center gap-3 justify-end"></div>
   
           <div className="w-full hidden py-3 sm:flex justify-center">
            {/* <TemplatePage/> */}
             {containerRef && <SelectedTemplate containerRef={containerRef} />}
           </div>
         </div>
       </main>
  )
}

export default MainTemplate
