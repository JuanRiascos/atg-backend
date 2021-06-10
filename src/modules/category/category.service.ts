import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/academy/category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  async getCategory(id: number) {
    const category = await this.categoryRepository.findOne(
      {
        where: { id },
        join: {
          alias: 'cat',
          leftJoinAndSelect: {
            childs: 'cat.childs'
          }
        }
      },
    )

    if (!category)
      return { error: 'NOT_FOUND', message: 'La categoria no existe' }

    return category
  }

  async getCategoriesPrincipals() {
    let categories = await this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.childs', 'childs')
      .where('category.principal = true')
      .getMany()

    return categories
  }

  async createCategory(body: CategoryDto) {
    const { title, description, parentId } = body

    let category
    try {
      if (parentId) {
        const parent = await this.categoryRepository.findOne({
          where: {
            id: parentId,
            principal: true
          }
        })
        if (!parent)
          throw new BadRequestException()

        category = await this.categoryRepository.save({
          title,
          description,
          parent
        })
      } else {
        category = await this.categoryRepository.save({
          title,
          description,
          principal: true
        })
      }
    } catch (error) {
      return { error }
    }

    return category
  }

  async updateCategory(id: number, body: CategoryDto) {
    const update = await this.categoryRepository.update(id, {
      title: body.title,
      description: body.description
    })

    if (update.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Error al actualizar la categoria' }

    const category = await this.categoryRepository.findOne({ where: { id } })

    return category
  }

  async deleteCategory(id: number) {
    const deleted = await this.categoryRepository.delete(id)

    if (deleted.affected !== 1)
      return { error: 'ERROR_DELETE', message: 'Ocurrio un error al eliminar!' }

    return deleted
  }
}
