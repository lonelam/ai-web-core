import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1684911861871 implements MigrationInterface {
    name = 'InitialMigration1684911861871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL DEFAULT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`secretAuthPasswd\` varchar(255) NOT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`role\` enum ('admin', 'normal', 'task_slave', 'anonymous') NOT NULL DEFAULT 'anonymous', UNIQUE INDEX \`IDX_EMAIL\` (\`email\`), UNIQUE INDEX \`IDX_USER_NAME\` (\`userName\`), INDEX \`IDX_PHONE\` (\`phone\`), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`authority\` (\`id\` int NOT NULL AUTO_INCREMENT, \`featureKey\` varchar(255) NOT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ownerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task_template_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task_template\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dataSchema\` text NOT NULL, \`resultSchema\` text NOT NULL, \`visible\` tinyint NOT NULL, \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleteTime\` datetime(6) NULL DEFAULT NULL, \`metaId\` int NOT NULL, UNIQUE INDEX \`IDX_NAME\` (\`name\`), UNIQUE INDEX \`REL_7b19ea4cfb01d1f93e0c6ac2b9\` (\`metaId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task_worker\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ip\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`workerStatus\` enum ('invalid', 'offline', 'online') NOT NULL DEFAULT 'offline', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` enum ('init', 'queueing', 'pending', 'running', 'failed', 'success') NOT NULL DEFAULT 'init', \`data\` text NOT NULL, \`resultData\` text NULL DEFAULT NULL, \`progressData\` text NULL DEFAULT NULL, \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`templateId\` int NOT NULL, \`workerId\` int NULL DEFAULT NULL, \`creatorId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`authority\` ADD CONSTRAINT \`FK_owner\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_template\` ADD CONSTRAINT \`FK_meta\` FOREIGN KEY (\`metaId\`) REFERENCES \`task_template_meta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_template\` FOREIGN KEY (\`templateId\`) REFERENCES \`task_template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_creator\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_worker\` FOREIGN KEY (\`workerId\`) REFERENCES \`task_worker\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_worker\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_creator\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_template\``);
        await queryRunner.query(`ALTER TABLE \`task_template\` DROP FOREIGN KEY \`FK_meta\``);
        await queryRunner.query(`ALTER TABLE \`authority\` DROP FOREIGN KEY \`FK_owner\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP TABLE \`task_worker\``);
        await queryRunner.query(`DROP INDEX \`REL_7b19ea4cfb01d1f93e0c6ac2b9\` ON \`task_template\``);
        await queryRunner.query(`DROP INDEX \`IDX_NAME\` ON \`task_template\``);
        await queryRunner.query(`DROP TABLE \`task_template\``);
        await queryRunner.query(`DROP TABLE \`task_template_meta\``);
        await queryRunner.query(`DROP TABLE \`authority\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_PHONE\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_USER_NAME\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_EMAIL\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
