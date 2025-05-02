import { db } from "@/utils/db";
import { Courses } from "@/utils/schema";

export async function GET() {
  const data = await db.select().from(Courses);
  return Response.json(data);
}
