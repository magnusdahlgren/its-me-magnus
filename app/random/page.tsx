import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function NotePage() {
  const { data } = await supabase.from("random_note").select("*").single();

  if (data?.id) {
    redirect(`/p/${data.id}`);
  }

  redirect("/p/start");
}
