import { MigrationInterface, QueryRunner } from "typeorm";

export class DisableForeignKeys1729492109772 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE follows DISABLE TRIGGER ALL;');

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE follows ENABLE TRIGGER ALL;');

    }

}
