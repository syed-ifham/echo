import {cookies} from "next/headers";
import {
    SidebarInset, SidebarProvider
} from "@/components/ui/sidebar";
import {DashboardSidebar} from "@/features/dashboard/components/dashboard-sidebar";


export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {

    // remember user preference for sidebar (open or close)
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get('sidebar_state')?.value === "true";


    return (

        // sidebar_state store by SidebarProvider
        <SidebarProvider defaultOpen={true} className="h-svh">

            <DashboardSidebar />
            <SidebarInset className="min-h-0 min-w-0">
                <main className="flex min-h-0 flex-1 flex-col">
                    {children}
                </main>
            </SidebarInset>

        </SidebarProvider>
    );
}
