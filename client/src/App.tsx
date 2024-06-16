import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      const response = await fetch("/api/expenses/total-spent");
      const data = await response.json();

      setTotalSpent(data.totalAmount);
    };

    fetchTotal();
  }, []);

  return (
    <div className="flex flex-col max-w-md mx-auto my-4">
      <Card>
        <CardHeader>
          <CardTitle>Total spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent className="font-semibold">${totalSpent}</CardContent>
      </Card>
    </div>
  );
}

export default App;
