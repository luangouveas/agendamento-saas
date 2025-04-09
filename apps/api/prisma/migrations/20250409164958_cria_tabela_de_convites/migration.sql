-- CreateTable
CREATE TABLE "convites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autor_id" TEXT,
    "organizacao_id" TEXT NOT NULL,

    CONSTRAINT "convites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "convites_email_idx" ON "convites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "convites_email_organizacao_id_key" ON "convites"("email", "organizacao_id");

-- AddForeignKey
ALTER TABLE "convites" ADD CONSTRAINT "convites_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convites" ADD CONSTRAINT "convites_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
