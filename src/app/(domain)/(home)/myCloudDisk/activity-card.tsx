"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ActivityLogVO } from "@/interface/files";
import { format } from "date-fns/format";

export const ActivityCard = ({
  activities,
  className,
}: {
  activities: ActivityLogVO[];
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>最近活动</CardTitle>
      <CardDescription>最近文件操作记录</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 bg-blue-500 rounded-full" />
          {`${format(new Date(activity.createdAt), "yyyy年MM月dd日 HH:mm")} - ${
            activity.action
          } ${activity.fileName}`}
        </div>
      ))}
    </CardContent>
  </Card>
);
