"use client";

import { BookOpen, Home, Settings, Store, Brain } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavSecondary } from "./nav-secondary"
import { useSession } from "next-auth/react"
import { useOrganisation } from "@/hooks/useOrganisation";


// Menu items
const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Practice Questions", url: "/practice-questions", icon: Brain },
]

const toolItems = [
    { title: "Bibliography Creator", url: "/bibliography-creator", icon: BookOpen },
]

const footerItems = [
    { title: "Settings", url: "/settings", icon: Settings },
]

// Sidebar component with inset variant
export function AppSidebar() {
    const { data: session } = useSession();
    const { organisation, loading } = useOrganisation();


    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <Store className="h-5 w-5" />
                                <span className="text-base font-semibold">{loading ? "...": (organisation?.name ?? session?.user.firstname)}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="flex items-center space-x-2">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {toolItems.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={`/tools/${item.url}`} className="flex items-center space-x-2">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <NavSecondary items={footerItems} className="mt-auto" />
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    )
}
