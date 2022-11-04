CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE "Deposit" DROP COLUMN "transferTime";
ALTER TABLE "Deposit" DROP COLUMN "amount";
ALTER TABLE "Deposit" DROP COLUMN "accountId";

ALTER TABLE "Transfer" DROP COLUMN "transferTime";
ALTER TABLE "Transfer" DROP COLUMN "amount";
ALTER TABLE "Transfer" DROP COLUMN "senderAccountId";
