import { Sidebar } from "@/components/admin/Sidebar";
import ClientInteractivity from "@/components/ClientInteractivity";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="admin-layout-wrapper" style={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            position: "relative",
            overflow: "auto"
        }}>

            <ClientInteractivity />

            {/* ── Content Layer ── */}
            <Sidebar />
            <main className="admin-main-content" style={{
                marginLeft: 260,
                flex: 1,
                padding: "40px 5% 60px",
                position: "relative",
                zIndex: 10, // Ensure content is above the background
                minHeight: "100vh"
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
