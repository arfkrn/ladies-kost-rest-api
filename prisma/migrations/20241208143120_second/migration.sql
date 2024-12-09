-- CreateTable
CREATE TABLE "Kost" (
    "id" SERIAL NOT NULL,
    "nomor" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Kost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KostImages" (
    "id" SERIAL NOT NULL,
    "kostId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "KostImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kost_id_key" ON "Kost"("id");

-- AddForeignKey
ALTER TABLE "KostImages" ADD CONSTRAINT "KostImages_kostId_fkey" FOREIGN KEY ("kostId") REFERENCES "Kost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
