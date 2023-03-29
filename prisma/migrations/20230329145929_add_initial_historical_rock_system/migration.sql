-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "humanReadableDate" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rock" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "humanReadableId" INTEGER NOT NULL,

    CONSTRAINT "Rock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_humanReadableDate_key" ON "Session"("humanReadableDate");

-- CreateIndex
CREATE UNIQUE INDEX "Rock_id_key" ON "Rock"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rock_uniqueId_key" ON "Rock"("uniqueId");

-- AddForeignKey
ALTER TABLE "Rock" ADD CONSTRAINT "Rock_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
