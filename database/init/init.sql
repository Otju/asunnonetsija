CREATE TABLE "apartments"(
  "id" SERIAL PRIMARY KEY,
  "link" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "district" TEXT NOT NULL,
  "sqrMeters" NUMERIC NOT NULL,
  "loanFreePrice" NUMERIC NOT NULL,
  "sellingPrice" NUMERIC,
  "pricePerSqrMeter" INT,
  "rooms" TEXT,
  "roomAmount" INT,
  "condition" TEXT,
  "houseType" TEXT,
  "livingType" TEXT,
  "plotType" TEXT,
  "newBuilding" BOOLEAN,
  "buildYear" INT,
  "loanFee" NUMERIC,
  "maintananceFee" NUMERIC,
  "waterFee" NUMERIC,
  "otherFees" NUMERIC,
  "imageLink" TEXT NOT NULL,
  "smallDistrict" TEXT NOT NULL,
  "bigDistrict" TEXT NOT NULL
);

CREATE TABLE "travelTimes"(
  "id" SERIAL PRIMARY KEY,
  "startLocation" TEXT NOT NULL,
  "endLocation" TEXT NOT NULL,
  "duration" INT NOT NULL
);


CREATE TABLE "endLocations"(
  "id" SERIAL PRIMARY KEY,
  "address" TEXT NOT NULL,
  "longitude" NUMERIC NOT NULL,
  "latitude" NUMERIC NOT NULL
);