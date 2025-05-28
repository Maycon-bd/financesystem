import { DashboardView } from "@/views/dashboard/dashboard-view"
import { getCurrentUser } from "@/controllers/auth-controller"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <DashboardView />
}
