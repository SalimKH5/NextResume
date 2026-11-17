import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import MainTemplate from "@/components/MainTemplate";
import { Navbar1 } from "@/components/Navbar";
import { authOptions } from "@/lib/AuthOption";
import clientPromise from "@/lib/mongodb";

// Read straight from the database (scoped to the session user) instead of
// fetching our own API over HTTP, which needed NEXT_PUBLIC_BASE_URL and cookie forwarding.
async function getResume(userId: string, id: string): Promise<GetTypeInformation | null> {
  if (!ObjectId.isValid(id)) return null;
  const client = await clientPromise;
  const doc = await client
    .db()
    .collection("templates_info")
    .findOne({ _id: new ObjectId(id), user_id: userId });
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc)) as GetTypeInformation;
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id_template: string }>;
}) {
  const { id_template } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/Auth");

  const resume = await getResume(String(session.user.id), id_template);
  if (!resume) notFound();

  return (
    <>
      <Navbar1 />
      <main id="main" tabIndex={-1} className="h-auto w-full bg-muted/60 md:min-h-[calc(100svh-4rem)]">
        <MainTemplate info={resume} />
      </main>
    </>
  );
}
