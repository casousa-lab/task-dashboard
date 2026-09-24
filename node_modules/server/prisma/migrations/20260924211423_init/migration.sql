-- CreateEnum
CREATE TYPE "task_category" AS ENUM ('ACADEMIC', 'PERSONAL');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "category" "task_category" NOT NULL,
    "status" "task_status" NOT NULL DEFAULT 'TODO',
    "due_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_tasks_status" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "idx_tasks_category" ON "tasks"("category");

-- CreateIndex
CREATE INDEX "idx_tasks_due_date" ON "tasks"("due_date");
