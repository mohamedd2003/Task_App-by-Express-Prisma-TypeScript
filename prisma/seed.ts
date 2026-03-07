import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
    url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log(" Seeding database...\n");

    // ── Clean existing data ────────────────────────────────────
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // ── Create Users ───────────────────────────────────────────
    const users = await Promise.all([
        prisma.user.create({ data: { name: "Alice Johnson" } }),
        prisma.user.create({ data: { name: "Bob Smith" } }),
        prisma.user.create({ data: { name: "Charlie Brown" } }),
    ]);
    console.log(` Created ${users.length} users`);

    // ── Create Tasks ───────────────────────────────────────────
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: "Design database schema",
                description: "Create the initial Prisma schema with all required models, relations, and indexes.",
                status: "DONE",
                priority: "HIGH",
                category: "BACKEND",
                ownerId: users[0].id,
                startDate: new Date("2026-03-01"),
                dueDate: new Date("2026-03-10"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Implement REST API endpoints",
                description: "Build all CRUD endpoints for tasks including pagination, filtering, and validation.",
                status: "IN_PROGRESS",
                priority: "URGENT",
                category: "BACKEND",
                ownerId: users[0].id,
                startDate: new Date("2026-03-05"),
                dueDate: new Date("2026-03-15"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Write unit tests",
                description: "Add comprehensive tests for all service layer methods and API endpoints.",
                status: "BACKLOG",
                priority: "MEDIUM",
                category: "BACKEND",
                ownerId: users[1].id,
                dueDate: new Date("2026-03-20"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Setup CI/CD pipeline",
                description: "Configure GitHub Actions for automated testing and deployment.",
                status: "BACKLOG",
                priority: "LOW",
                category: "DEVOPS",
                ownerId: users[2].id,
            },
        }),
        prisma.task.create({
            data: {
                title: "Add authentication",
                description: "Implement JWT-based authentication with login and registration.",
                status: "BLOCKED",
                priority: "HIGH",
                category: "BACKEND",
                ownerId: users[1].id,
                startDate: new Date("2026-03-08"),
                dueDate: new Date("2026-03-25"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Create API documentation",
                description: "Document all endpoints with Swagger/OpenAPI spec.",
                status: "BACKLOG",
                priority: "LOW",
                category: "BACKEND",
            },
        }),
        prisma.task.create({
            data: {
                title: "Optimize database queries",
                description: "Review and optimize N+1 queries and add proper indexing.",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                category: "BACKEND",
                ownerId: users[2].id,
                startDate: new Date("2026-03-06"),
                dueDate: new Date("2026-03-18"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Old archived task",
                description: "This task has been completed and archived.",
                status: "DONE",
                priority: "LOW",
                category: "BACKEND",
                archived: true,
                ownerId: users[0].id,
            },
        }),
        prisma.task.create({
            data: {
                title: "Build dashboard UI",
                description: "Create the main dashboard with task cards, filters, and drag-and-drop columns.",
                status: "IN_PROGRESS",
                priority: "HIGH",
                category: "FRONTEND",
                ownerId: users[1].id,
                startDate: new Date("2026-03-04"),
                dueDate: new Date("2026-03-20"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Setup Docker containers",
                description: "Containerize the app with Docker and create docker-compose for local development.",
                status: "BACKLOG",
                priority: "MEDIUM",
                category: "DEVOPS",
                ownerId: users[2].id,
                dueDate: new Date("2026-03-22"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Implement responsive layout",
                description: "Make the frontend fully responsive for mobile and tablet viewports.",
                status: "BACKLOG",
                priority: "MEDIUM",
                category: "FRONTEND",
                ownerId: users[1].id,
                dueDate: new Date("2026-03-28"),
            },
        }),
        prisma.task.create({
            data: {
                title: "Configure monitoring and logging",
                description: "Set up centralized logging and health-check monitoring for production.",
                status: "BACKLOG",
                priority: "LOW",
                category: "DEVOPS",
                ownerId: users[2].id,
            },
        }),
    ]);
    console.log(` Created ${tasks.length} tasks`);

    // ── Create Comments ────────────────────────────────────────
    const comments = await Promise.all([
        prisma.comment.create({
            data: {
                taskId: tasks[0].id,
                message: "Schema looks good. Added indexes for frequently queried columns.",
            },
        }),
        prisma.comment.create({
            data: {
                taskId: tasks[0].id,
                message: "Approved! Moving to implementation phase.",
            },
        }),
        prisma.comment.create({
            data: {
                taskId: tasks[1].id,
                message: "Started with GET /tasks endpoint. Pagination is working.",
            },
        }),
        prisma.comment.create({
            data: {
                taskId: tasks[1].id,
                message: "POST and PATCH endpoints done. Need to add validation.",
            },
        }),
        prisma.comment.create({
            data: {
                taskId: tasks[1].id,
                message: "Added Zod validation. All endpoints are now complete.",
            },
        }),
        prisma.comment.create({
            data: {
                taskId: tasks[4].id,
                message: "Blocked by: need to decide on auth provider (Auth0 vs custom JWT).",
            },
        }),
        prisma.comment.create({
            data: {
                taskId: tasks[6].id,
                message: "Found 3 N+1 queries in the task listing. Fixing now.",
            },
        }),
    ]);
    console.log(` Created ${comments.length} comments`);

    console.log("\n Seeding complete!");
}

main()
    .catch((e) => {
        console.error(" !!!! Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
