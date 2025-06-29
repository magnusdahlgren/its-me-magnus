import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function NotePage() {
  const { data, error } = await supabase
    .from("random_note")
    .select("id")
    .single();

  if (error) {
    console.error("Failed to fetch random note:", error);
    redirect("/p/start");
  }

  if (data?.id) {
    redirect(`/p/${data.id}`);
  }

  redirect("/p/start");
}
