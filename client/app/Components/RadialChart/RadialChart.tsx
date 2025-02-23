"use client";
import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { useTasks } from "@/context/taskContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Completed",
    color: "#FFD700", // Gold for completed tasks
  },
  mobile: {
    label: "Pending",
    color: "#000000", // Black for pending tasks
  },
} satisfies ChartConfig;

function RadialChart() {
  const { tasks, completedTasks, activeTasks, previousCompletedTasks } = useTasks();
  const tasksTotal = tasks.length;
  const currentCompletedTasks = completedTasks.length;

  // Check if previous month data exists
  const isFirstMonth = previousCompletedTasks === undefined || previousCompletedTasks === null;

  // Calculate percentage change
  const percentageChange = isFirstMonth
    ? null
    : ((currentCompletedTasks - previousCompletedTasks) / previousCompletedTasks) * 100;

  const chartData = [
    {
      pending: activeTasks.length,
      completed: currentCompletedTasks,
    },
  ];

  return (
    <Card className="flex flex-col border-2 border-[#FFD700] shadow-none bg-[#EDEDED]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Completed vs Pending Tasks</CardTitle>
        <CardDescription>Task completion status.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {tasksTotal}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="completed"
              stackId="a"
              cornerRadius={5}
              fill="#FFD700" // Gold
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="pending"
              fill="#000000" // Black
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {isFirstMonth ? (
          <div className="leading-none text-muted-foreground">
            This is your first month! From next month, you'll see task completion trends.
          </div>
        ) : (
          <div className="flex items-center gap-2 font-medium leading-none">
            Task completion {percentageChange !== null && percentageChange >= 0 ? "improved" : "declined"} by{" "}
            {percentageChange !== null ? Math.abs(percentageChange).toFixed(1) : "0.0"}% this month{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Analysis based on tasks completed in the last 30 days.
        </div>
      </CardFooter>
    </Card>
  );
}

export default RadialChart;
