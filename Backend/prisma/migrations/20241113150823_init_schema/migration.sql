-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "carTypeId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "dealerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imagesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CarType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "search_idx" ON "Car"("title", "description");

-- CreateIndex
CREATE INDEX "car_type_idx" ON "Car"("carTypeId");

-- CreateIndex
CREATE INDEX "company_idx" ON "Car"("companyId");

-- CreateIndex
CREATE INDEX "dealer_idx" ON "Car"("dealerId");

-- CreateIndex
CREATE INDEX "title_car_type_idx" ON "Car"("title", "carTypeId");

-- CreateIndex
CREATE INDEX "title_company_idx" ON "Car"("title", "companyId");

-- CreateIndex
CREATE INDEX "title_dealer_idx" ON "Car"("title", "dealerId");

-- CreateIndex
CREATE INDEX "description_car_type_idx" ON "Car"("description", "carTypeId");

-- CreateIndex
CREATE INDEX "description_company_idx" ON "Car"("description", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CarType_name_key" ON "CarType"("name");

-- CreateIndex
CREATE INDEX "car_type_name_idx" ON "CarType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dealer_name_key" ON "Dealer"("name");

-- CreateIndex
CREATE INDEX "dealer_name_idx" ON "Dealer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Image_carId_url_key" ON "Image"("carId", "url");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carTypeId_fkey" FOREIGN KEY ("carTypeId") REFERENCES "CarType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
