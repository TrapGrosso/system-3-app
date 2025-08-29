import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconMailSpark,
  IconChecklist,
  IconMessageCircle,
  IconBolt,
  IconUsersGroup,
  IconLogs,
  IconListSearch
} from "@tabler/icons-react"

import { AppSidebar } from "@/components/navigation/app-sidebar"
import { SiteHeader } from "@/components/navigation/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

function processUser(user) {
  const name = user.user_metadata.name || user.email.split('@')[0];
  const email = user.email;
  const avatar = null; // For now, avatar is null

  let fallback = '';
  if (name) {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      fallback = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      fallback = nameParts[0][0].toUpperCase();
    }
  } else {
    fallback = email[0].toUpperCase();
  }

  return {
    name,
    email,
    avatar,
    fallback
  };
}

export function DashboardLayout({ children, headerText = "Dashboard" }) {
  const { user, signOut } = useAuth()
  console.log(user)

  const processedUser = processUser(user);

  const sidebarData = {
    user: {
      name: processedUser.name,
      email: processedUser.email,
      avatar: processedUser.avatar,
      fallback: processedUser.fallback
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard
      },
      {
        title: "People & Companies",
        url: "/people&companies",
        icon: IconListSearch
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
    navPrimary: [
      {
        name: "Groups",
        url: "/groups",
        icon: IconUsersGroup,
        dropdownItems: [
          { label: "All Groups", action: "view-all" },
          { label: "My Groups", action: "view-mine" }
        ]
      },
      {
        name: "Logs",
        url: "/logs",
        icon: IconLogs
      },
      {
        name: "Tasks",
        url: "/tasks",
        icon: IconChecklist,
        dropdownItems: [
          { label: "All Tasks", action: "view-all" },
          { label: "My Tasks", action: "view-mine" },
          { label: "Overdue", action: "view-overdue" }
        ]
      },
      {
        name: "Prompts",
        url: "/prompts",
        icon: IconMessageCircle,
        dropdownItems: [
          { label: "Create New", action: "create" },
          { label: "Templates", action: "templates" },
          { label: "Export", action: "export" }
        ]
      },
      /*{
        name: "Custom Actions",
        url: "/custom-actions",
        icon: IconBolt,
        dropdownItems: [
          { label: "Create Action", action: "create" },
          { label: "View Logs", action: "logs" },
          { label: "Settings", action: "settings" }
        ]
      }*/
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
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
            <div className="flex flex-col gap-4 py-4 min-h-full md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
