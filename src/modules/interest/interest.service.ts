import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interest } from 'src/entities/academy/interest.entity';
import { Repository } from 'typeorm';
import { InterestDto } from './dto/interest.dto';

@Injectable()
export class InterestService {

  constructor(
    @InjectRepository(Interest) private readonly interestRepository: Repository<Interest>
  ) { }

  async getInterest(id: number) {
    const interest = await this.interestRepository.findOne(
      {
        where: { id },
        join: {
          alias: 'int',
          leftJoinAndSelect: {
            childs: 'int.childs'
          }
        }
      },
    )

    if (!interest)
      return { error: 'NOT_FOUND', message: 'El interes no existe' }

    return interest
  }

  async getCategoriesPrincipals() {
    let interests = await this.interestRepository.createQueryBuilder('interest')
      .leftJoinAndSelect('interest.childs', 'childs')
      .where('interest.principal = true')
      .orderBy('interest.title')
      .addOrderBy('childs.title')
      .getMany()

    return interests
  }

  async createInterest(body: InterestDto) {
    const { title, description, parentId } = body

    let interest
    try {
      if (parentId) {
        const parent = await this.interestRepository.findOne({
          where: {
            id: parentId,
            principal: true
          }
        })
        if (!parent)
          throw new BadRequestException()

        interest = await this.interestRepository.save({
          title,
          description,
          parent
        })
      } else {
        interest = await this.interestRepository.save({
          title,
          description,
          principal: true
        })
      }
    } catch (error) {
      return { error }
    }

    return interest
  }

  async updateInterest(id: number, body: InterestDto) {
    const update = await this.interestRepository.update(id, {
      title: body.title,
    })

    if (update.affected !== 1)
      return { error: 'ERROR_UPDATE', message: 'Error al actualizar la categoria' }

    const interest = await this.interestRepository.findOne({ where: { id } })

    return interest
  }

  async deleteInterest(id: number) {
    const deleted = await this.interestRepository.delete(id)

    if (deleted.affected !== 1)
      return { error: 'ERROR_DELETE', message: 'Ocurrio un error al eliminar!' }

    return deleted
  }
}
