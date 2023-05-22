import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isJSON } from 'class-validator';
import { Repository } from 'typeorm';
import { TaskTemplate } from '../dto/taskTemplate.entity';
import {
  ICreateTemplate,
  IUpdateTemplate,
} from '../dto/taskTemplate.interface';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TaskTemplate)
    private templateRepository: Repository<TaskTemplate>,
  ) {}

  async getTemplateById(id: number) {
    return this.templateRepository.findOneBy({ id });
  }

  async getVisibleTemplates() {
    return await this.templateRepository.findBy({ visible: true });
  }

  async createTemplate(creationData: ICreateTemplate) {
    const { name, dataSchema, resultSchema, visible, meta } = creationData;

    if (!isJSON(dataSchema)) {
      throw new BadRequestException(`the dataSchema should be valid JSON`);
    }

    if (!isJSON(resultSchema)) {
      throw new BadRequestException(`the resultSchema should be valid JSON`);
    }
    const template = new TaskTemplate();
    template.name = name;
    template.dataSchema = dataSchema;
    template.resultSchema = resultSchema;
    template.visible = visible;
    template.meta = meta;
    const savedTemplate = await this.templateRepository.save(template);
    return savedTemplate;
  }
  async updateTemplate(updateData: IUpdateTemplate) {
    const { id, name, dataSchema, resultSchema, visible, meta } = updateData;
    const template = await this.getTemplateById(id);
    if (!template) {
      throw new BadRequestException(
        `the update template[${id}] do not exists!`,
      );
    }
    if (name !== undefined) {
      template.name = name;
    }

    if (visible !== undefined) {
      template.visible = visible;
    }

    if (meta !== undefined) {
      template.meta = meta;
    }

    if (dataSchema !== undefined) {
      if (!isJSON(dataSchema)) {
        throw new BadRequestException(`the dataSchema should be valid JSON`);
      }
      template.dataSchema = dataSchema;
    }
    if (resultSchema !== undefined) {
      if (!isJSON(resultSchema)) {
        throw new BadRequestException(`the resultSchema should be valid JSON`);
      }
      template.resultSchema = resultSchema;
    }
    const updatedTemplate = await this.templateRepository.save(template);
    return updatedTemplate;
  }

  async getAllTemplates(): Promise<TaskTemplate[]> {
    return this.templateRepository.find();
  }

  async deleteTemplate(id: number): Promise<void> {
    const result = await this.templateRepository.softDelete({ id });
    if (!result.affected) {
      throw new BadRequestException(
        `there's no task template deleted by id=${id}`,
      );
    }
  }
}
