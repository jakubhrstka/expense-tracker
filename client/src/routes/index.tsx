import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

const getTotalSpent = async () => {
  const res = await api.expenses["total-spent"].$get();

  if (!res.ok) throw new Error("Server error");

  const data = await res.json();
  return data;
};

function Index() {
  const { data, isPending, error } = useQuery({
    queryKey: ["totalSpent"],
    queryFn: getTotalSpent,
  });

  return (
    <div className="flex flex-col max-w-md mx-auto my-4">
      {isPending ? (
        <div>loading...</div>
      ) : error ? (
        <div>error: {error.message}</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Total spent</CardTitle>
            <CardDescription>The total amount you've spent</CardDescription>
          </CardHeader>
          <CardContent className="font-semibold">
            ${data?.totalAmount ?? 0}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
