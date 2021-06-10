import {
  Controller,
  Request,
  Get,
  Body,
  Put,
  UseGuards,
  UnauthorizedException,
  Req,
  BadRequestException,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdatePersonDto } from './dto/update-person.dto';
import { PermissionsService } from './services/permissions.service';
import { PersonService } from './services/person.service';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { FindService } from './services/find.service';
import { ManageService } from './services/manage.service';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { Roles as roles } from '../../@common/constants/role.constant'
import { Permissions as permissions } from '../../@common/constants/permission.constant'
import { Permissions } from 'src/@common/decorators/permissions.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly personService: PersonService,
    private readonly findService: FindService,
    private readonly manageService: ManageService
  ) { }

  @Get('/get-permissions')
  @UseGuards(AuthGuard('jwt'))
  async getPermissions(@Request() req): Promise<ResponseError | ResponseSuccess> {
    const permissions = await this.permissionsService.getPermissions(req.user.id);

    if (permissions)
      return { success: 'OK', payload: permissions }

    throw new UnauthorizedException({ error: 'UNAUTHORIZED' });
  }

  @Get('/get-person')
  @UseGuards(AuthGuard('jwt'))
  async getPerson(@Request() req): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.personService.getPerson(req.user.id);

    if (response.error)
      throw new UnauthorizedException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/update-person')
  @UseGuards(AuthGuard('jwt'))
  async updatePerson(@Request() req, @Body() body: UpdatePersonDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.personService.updatePerson(req.user.id, body);

    if (response.error) {
      if (response.error === 'USER_INACTIVE')
        throw new UnauthorizedException(response)

      throw new BadRequestException(response)
    }

    return { success: 'OK', message: 'Datos actualizados correctamente' }
  }

  @Get('/list-admins')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  async getListAdmins(@Req() req): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.findService.getListAdmins(req.user.id)

    if (response.error)
      throw new NotFoundException(response)

    return { success: 'OK', payload: response }
  }

  @Put('/delete-admin/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(roles.ADMIN)
  @Permissions(permissions.ADMIN_USERS)
  async deleteAdmin(@Param('id', ParseIntPipe) id: number): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.manageService.deleteAdmin(id)

    if (response.error)
      throw new NotFoundException(response)

    return { success: 'OK', payload: response }
  }

}
