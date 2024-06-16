import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50.25 },
  { id: 2, title: "Rent", amount: 1200.0 },
  { id: 3, title: "Utilities", amount: 150.75 },
  { id: 4, title: "Internet", amount: 60.0 },
  { id: 5, title: "Transportation", amount: 75.5 },
  { id: 6, title: "Dining Out", amount: 40.0 },
  { id: 7, title: "Entertainment", amount: 85.0 },
  { id: 8, title: "Subscription", amount: 12.99 },
  { id: 9, title: "Health Insurance", amount: 300.0 },
  { id: 10, title: "Gym Membership", amount: 25.0 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((exp) => exp.id === id);

    if (!expense) return c.notFound();

    return c.json({ ...expense });
  })
  .get("total-spent", (c) => {
    const totalAmount = fakeExpenses.reduce((acc, expense) => {
      return (acc += expense.amount);
    }, 0);

    return c.json({ totalAmount });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");

    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    return c.json({ ...expense }, 201);
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expenseIndex = fakeExpenses.findIndex((exp) => exp.id === id);

    if (expenseIndex === -1) return c.notFound();

    const deletedExpense = fakeExpenses.splice(expenseIndex, 1);

    return c.json({ ...deletedExpense[0] });
  });
// .put
