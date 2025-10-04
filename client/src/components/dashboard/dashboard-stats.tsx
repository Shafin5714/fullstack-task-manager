import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  taskCounts: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export function DashboardStats({ taskCounts }: DashboardStatsProps) {
  const completionRate =
    taskCounts.all > 0
      ? Math.round((taskCounts.completed / taskCounts.all) * 100)
      : 0;

  const stats = [
    {
      title: "Total Tasks",
      value: taskCounts.all,
      icon: TrendingUp,
      description: "All tasks in the system",
    },
    {
      title: "Pending",
      value: taskCounts.pending,
      icon: Clock,
      description: "Tasks waiting to start",
    },
    {
      title: "In Progress",
      value: taskCounts.inProgress,
      icon: AlertCircle,
      description: "Currently active tasks",
    },
    {
      title: "Completed",
      value: taskCounts.completed,
      icon: CheckCircle,
      description: `${completionRate}% completion rate`,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 my-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
