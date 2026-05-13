-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "cartoColoniaId" UUID,
ADD COLUMN     "cartoPredioId" UUID,
ADD COLUMN     "coverPhotoStorageKey" TEXT;

-- CreateIndex
CREATE INDEX "Property_cartoPredioId_idx" ON "Property"("cartoPredioId");
