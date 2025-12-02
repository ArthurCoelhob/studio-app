import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1764712535430 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "service_type" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "sessionCount" integer NOT NULL,
                CONSTRAINT "UQ_service_type_name" UNIQUE ("name"),
                CONSTRAINT "PK_service_type" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "client" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "cpf" character varying NOT NULL,
                "address" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "attendance" integer NOT NULL DEFAULT '0',
                "serviceTypeId" integer NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'client',
                CONSTRAINT "UQ_client_cpf" UNIQUE ("cpf"),
                CONSTRAINT "UQ_client_email" UNIQUE ("email"),
                CONSTRAINT "PK_client" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TYPE "professional_profile_enum" AS ENUM('admin', 'professional')
        `);

        await queryRunner.query(`
            CREATE TABLE "professional" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "serviceTypeId" integer NOT NULL,
                "profile" "professional_profile_enum" NOT NULL,
                CONSTRAINT "PK_professional" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "client" ADD CONSTRAINT "FK_client_serviceType" 
            FOREIGN KEY ("serviceTypeId") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "professional" ADD CONSTRAINT "FK_professional_serviceType" 
            FOREIGN KEY ("serviceTypeId") REFERENCES "service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professional" DROP CONSTRAINT "FK_professional_serviceType"`);
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "FK_client_serviceType"`);
        await queryRunner.query(`DROP TABLE "professional"`);
        await queryRunner.query(`DROP TYPE "professional_profile_enum"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "service_type"`);
    }

}
