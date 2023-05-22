import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1684770158891 implements MigrationInterface {
    name = 'PostRefactoring1684770158891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`authority\` DROP FOREIGN KEY \`FK_0057e627fe734d09c326590a55e\``);
        await queryRunner.query(`ALTER TABLE \`authority\` CHANGE \`ownerId\` \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task_template\` DROP FOREIGN KEY \`FK_7b19ea4cfb01d1f93e0c6ac2b92\``);
        await queryRunner.query(`ALTER TABLE \`task_template\` CHANGE \`deleteTime\` \`deleteTime\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`task_template\` CHANGE \`metaId\` \`metaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_07160cadf83137f5cb86127539a\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_94fe6b3a5aec5f85427df4f8cd7\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_6ed550b4b10d0e5e1835e30566a\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`resultData\` \`resultData\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`progressData\` \`progressData\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`templateId\` \`templateId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`creatorId\` \`creatorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`workerId\` \`workerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`authority\` ADD CONSTRAINT \`FK_0057e627fe734d09c326590a55e\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_template\` ADD CONSTRAINT \`FK_7b19ea4cfb01d1f93e0c6ac2b92\` FOREIGN KEY (\`metaId\`) REFERENCES \`task_template_meta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_07160cadf83137f5cb86127539a\` FOREIGN KEY (\`templateId\`) REFERENCES \`task_template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_94fe6b3a5aec5f85427df4f8cd7\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_6ed550b4b10d0e5e1835e30566a\` FOREIGN KEY (\`workerId\`) REFERENCES \`task_worker\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_6ed550b4b10d0e5e1835e30566a\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_94fe6b3a5aec5f85427df4f8cd7\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_07160cadf83137f5cb86127539a\``);
        await queryRunner.query(`ALTER TABLE \`task_template\` DROP FOREIGN KEY \`FK_7b19ea4cfb01d1f93e0c6ac2b92\``);
        await queryRunner.query(`ALTER TABLE \`authority\` DROP FOREIGN KEY \`FK_0057e627fe734d09c326590a55e\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`workerId\` \`workerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`creatorId\` \`creatorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`templateId\` \`templateId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`progressData\` \`progressData\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`resultData\` \`resultData\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_6ed550b4b10d0e5e1835e30566a\` FOREIGN KEY (\`workerId\`) REFERENCES \`task_worker\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_94fe6b3a5aec5f85427df4f8cd7\` FOREIGN KEY (\`creatorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_07160cadf83137f5cb86127539a\` FOREIGN KEY (\`templateId\`) REFERENCES \`task_template\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_template\` CHANGE \`metaId\` \`metaId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task_template\` CHANGE \`deleteTime\` \`deleteTime\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task_template\` ADD CONSTRAINT \`FK_7b19ea4cfb01d1f93e0c6ac2b92\` FOREIGN KEY (\`metaId\`) REFERENCES \`task_template_meta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`authority\` CHANGE \`ownerId\` \`ownerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`authority\` ADD CONSTRAINT \`FK_0057e627fe734d09c326590a55e\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
