"use client";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const StorageCard = ({
  usedSpace,
  className,
}: {
  usedSpace: number;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>存储空间</CardTitle>
      <CardDescription>
        已使用 {((usedSpace / 5) * 100).toFixed(1)}%
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Progress value={(usedSpace / 5) * 100} className="h-2" />
      <div className="flex justify-between mt-4 text-sm">
        <span className="text-muted-foreground">
          {usedSpace.toFixed(1)} GB 已使用
        </span>
        <span className="text-muted-foreground">5 GB 总量</span>
      </div>
    </CardContent>
  </Card>
);
