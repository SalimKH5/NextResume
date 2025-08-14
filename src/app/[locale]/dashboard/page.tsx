"use client"
import CreateCV from "@/components/CreateCV";
import { useDragDrop } from "@/components/DraggableContext";
import SkillsForm from "@/components/SkillsForm";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";





const page = () => {
  const { data: session, update, status } = useSession();
  const { information } = useDragDrop();
  const [cvs,setCsv]=useState<any>([]);


  useEffect(()=>{
            const getCsv=async(user_id:string)=>{
            try {
                const result = await fetch(`/api/CvtTmplates?user_id=${user_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              
            });
            if(result.ok){
                    const data=await result.json();
                setCsv(data?.templates) ;
            }
            } catch (error) {
                console.log({error});
                return []
            }
    }
    if(status==="authenticated"){
              getCsv(session?.user.id!);
    }
  
  },[status])
console.log({cvs})

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="w-full max-w-2xl h-auto bg-gray-300 p-3 rounded-xl">
        <div className="w-full gap-3 flex items-center justify-end">
        <CreateCV></CreateCV>

        </div>
        <div className="w-full flex flex-col gap-3">
            
            {
                cvs.map((cv:any)=>(
                <Link href={`/cv-editions?id_template=${cv._id}`} key={cv._id} className="w-full bg-white text-black rounded-xl py-2 flex items-center justify-between">
                      <p>{cv?.title_template}</p>

                 </Link>
                ))
            }
            
        </div>
      </div>
    </div>
  );
};

export default page;
