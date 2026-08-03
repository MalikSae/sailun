import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  switch (session.user?.role) {
    case "ADMIN":
      redirect("/admin/dashboard");
    case "CLUB":
      redirect("/club/dashboard");
    case "DEALER":
      redirect("/dealer/scan");
    case "MEMBER":
      redirect("/member/dashboard");
    default:
      redirect("/");
  }
}
