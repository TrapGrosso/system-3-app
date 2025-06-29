import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconMailSpark,
} from "@tabler/icons-react"

import { AppSidebar } from "@/components/navigation/app-sidebar"
import { SiteHeader } from "@/components/navigation/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

export function DashboardLayout({ children, headerText = "Dashboard" }) {
  const { user, signOut } = useAuth()

  const sidebarData = {
    user: {
      name: user.user_metadata.name,
      email: user.email,
      avatar: "/avatars/shadcn.jpg",
      fallback: user.user_metadata.name.split('')[0].toUpperCase()
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard
      },
      {
        title: "Add Leads",
        url: "/add-leads",
        icon: IconListDetails,
      },
      {
        title: "Marketing",
        url: "/marketing",
        icon: IconChartBar,
      },
      {
        title: "Campaigns",
        url: "/campaigns",
        icon: IconMailSpark,
      }
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      }
    ]
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }
      }
    >
      <AppSidebar data={sidebarData} onSignOut={signOut} variant="inset" />
      <SidebarInset>
        <SiteHeader headerText={headerText} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
