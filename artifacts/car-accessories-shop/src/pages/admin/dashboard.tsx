import { AdminLayout } from "@/components/admin-layout";
import { useGetProductStats } from "@workspace/api-client-react";
import { Package, Tags, AlertTriangle, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetProductStats();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full bg-secondary" />)}
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: "Total Gear", value: stats?.totalProducts || 0, icon: Package, color: "text-blue-500" },
    { label: "Categories", value: stats?.totalCategories || 0, icon: Tags, color: "text-purple-500" },
    { label: "Out of Stock", value: stats?.outOfStock || 0, icon: AlertTriangle, color: "text-destructive" },
    { label: "Avg Price", value: `$${stats?.avgPrice?.toFixed(2) || '0.00'}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">Command Center</h1>
        <p className="text-muted-foreground">System overview and catalogue statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`p-2 bg-secondary rounded-md ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{stat.label}</h3>
              </div>
              <div className="text-4xl font-bold font-mono tracking-tight relative z-10">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {stats?.topCategory && (
        <div className="bg-secondary/50 border border-border p-6 inline-block">
          <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground block mb-1">Top Performing Category</span>
          <span className="text-xl font-bold uppercase text-primary">{stats.topCategory}</span>
        </div>
      )}
    </AdminLayout>
  );
}
