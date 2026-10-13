-- CreateEnum
CREATE TYPE "TheatreAdminAssignmentRole" AS ENUM ('PRIMARY_MANAGER', 'OPERATIONS_SUPERVISOR', 'BOX_OFFICE_LEAD');

-- AlterTable
ALTER TABLE "TheatreAdminAssignment" ADD COLUMN     "role" "TheatreAdminAssignmentRole" NOT NULL DEFAULT 'OPERATIONS_SUPERVISOR';
