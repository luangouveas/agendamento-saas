-- AlterTable
ALTER TABLE "organizacoes" ADD COLUMN     "intervaloAgenda" INTEGER NOT NULL DEFAULT 30;

-- CreateTable
CREATE TABLE "expedientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "expedientePrincipal" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "profissional_Id" TEXT NOT NULL,

    CONSTRAINT "expedientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diasExpediente" (
    "id" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "inicio" TEXT NOT NULL,
    "fim" TEXT NOT NULL,
    "inicioIntervalo" TEXT,
    "fimIntervalo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expediente_id" TEXT NOT NULL,

    CONSTRAINT "diasExpediente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diasExpediente_expediente_id_diaSemana_key" ON "diasExpediente"("expediente_id", "diaSemana");

-- AddForeignKey
ALTER TABLE "expedientes" ADD CONSTRAINT "expedientes_profissional_Id_fkey" FOREIGN KEY ("profissional_Id") REFERENCES "membros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diasExpediente" ADD CONSTRAINT "diasExpediente_expediente_id_fkey" FOREIGN KEY ("expediente_id") REFERENCES "expedientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
