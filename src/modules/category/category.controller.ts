import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { Roles as roles } from '../../@common/constants/role.constant'
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService
  ) { }

  @Get()
  async getCategory(@Query('id') id: number): Promise<ResponseError | ResponseSuccess> {
    if (!id)
      throw new BadRequestException()

    const response: any = await this.categoryService.getCategory(id)

    if (response.error)
      throw new NotFoundException(response)

    return { success: 'OK', payload: response }
  }

  @Get('/principals')
  async getPrincipals(): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.categoryService.getCategoriesPrincipals()

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async createCategory(@Body() body: CategoryDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.categoryService.createCategory(body)

    if (response.error)
      throw new BadRequestException(response.error)

    return { success: 'OK', payload: response }
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: CategoryDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.categoryService.updateCategory(id, body)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.categoryService.deleteCategory(id)

    if (response.error)
      throw new BadRequestException(response)

    return { success: 'OK', payload: response }
  }

}
