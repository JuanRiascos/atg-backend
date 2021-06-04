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
  UploadedFile
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdatePersonDto } from './dto/update-person.dto';
import { PermissionsService } from './services/permissions.service';
import { PersonService } from './services/person.service';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';

@Controller('user')
export class UserController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly personService: PersonService,
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

}
