import MainTemplate from "@/components/MainTemplate";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Navbar1 } from "@/components/Navbar";
import { authOptions } from "@/lib/AuthOption";

const getCvDetail = async (user_id: string, id_template?: string):Promise<GetTypeInformation|undefined> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; 
    let url = `${baseUrl}/api/CvtTmplates?user_id=${user_id}`;
    if (id_template) {
      url += `&id_template=${id_template}`;
    }
    console.log("Fetching:", url);

    const result = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // ensures fresh data on SSR
    });

    if (result.ok) {
      const data = await result.json();
      return data.templates || [];
    } else {
      console.error("Failed to fetch CV details:", result.statusText);
      return undefined;
    }
  } catch (error) {
    console.error("getCvDetail error:", error);
    return undefined;
  }
};

const Page = async ({
  params,
  searchParams,
}: {
  params: { id_template: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { id_template } = params;


  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/Auth"); // redirect to login if no session
  }

  const user_id = session.user.id;
  let template_data:GetTypeInformation|undefined;

  if(user_id){
      template_data = await getCvDetail(user_id!, id_template);
        console.log("Template data:", template_data);
  }
   



  return (
    <>
      <Navbar1 />
      <main className="w-full h-full">
        <MainTemplate info={template_data} />
      </main>
    </>
  );
};

export default Page;
