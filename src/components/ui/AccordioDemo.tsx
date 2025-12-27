import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PersonalInformation from "../PersonalInformation";
import { useDragDrop } from "../DraggableContext";
import ExprienceMobile from "../ExprienceMobile";
import { EllipsisIcon, EllipsisVerticalIcon, Menu } from "lucide-react";
import MenuAccordion from "./MenuExprience";
import { Button } from "./button";
import MenuExprience from "./MenuExprience";
import MenuEducations from "../MenuEducations";
export function AccordionDemo() {
    const {information}=useDragDrop();

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full "
    >
      <AccordionItem value="item-1" className="bg-white cursor-pointer px-2">
        <AccordionTrigger>Information</AccordionTrigger>
        <AccordionContent className="w-full flex items-center gap-3 flex-col  p-2  rounded-xl">
          <img src="/profile.jpg" alt="" width={150} height={150} />
          <PersonalInformation />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="bg-white cursor-pointer px-2">
        <AccordionTrigger   className="w-full flex items-center ">
            <p>Expriences Details</p>
          
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="w-full flex items-center justify-end py-3">
                              <MenuExprience/>    
                </div>
                {
                    information?.Expriences?.map((ex)=>(
                                <ExprienceMobile type="experience" ex={ex} key={ex.id}/>
                    ))
                }
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="bg-white cursor-pointer px-2">
        <AccordionTrigger>Educations Details</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance ">
          <div className="w-full flex items-center justify-end py-3">
                             <MenuEducations/>   
                </div>
                 
                {
                    information?.Educations?.map((educ)=>(
                                <ExprienceMobile type="education" ex={educ} key={educ.id}/>
                    )) 
                }
        </AccordionContent>
      </AccordionItem>
   
    </Accordion>
  );
}
