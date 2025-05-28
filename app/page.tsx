import { redirect } from "next/navigation"
import { getCurrentUser } from "@/controllers/auth-controller"

export default async function HomePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  redirect("/dashboard")
}
