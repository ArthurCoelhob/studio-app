import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBusinessHours1765308619566 implements MigrationInterface {
    name = 'CreateBusinessHours1765308619566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business_hours" ("id" SERIAL NOT NULL, "dayOfWeek" integer NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_560a76077605005da835fe505a5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "business_hours"`);
    }

}
