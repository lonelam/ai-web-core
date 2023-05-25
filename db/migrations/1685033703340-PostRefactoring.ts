import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1685033703340 implements MigrationInterface {
    name = 'PostRefactoring1685033703340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_PHONE\` ON \`user\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_PHONE\` ON \`user\` (\`phone\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_PHONE\` ON \`user\``);
        await queryRunner.query(`CREATE INDEX \`IDX_PHONE\` ON \`user\` (\`phone\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\` (\`phone\`)`);
    }

}
