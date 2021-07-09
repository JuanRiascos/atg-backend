import {
  Controller,
  Post,
  Body,
  Inject,
  BadRequestException,
  UseGuards,
  Req,
  Get,
  Res
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AuthGuard } from '@nestjs/passport';
import { SignUpService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { PasswordService } from './services/password.service'
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { ResponseError, ResponseSuccess } from 'src/@common/interfaces/response';
import { Roles } from 'src/@common/decorators/roles.decorator';
import { Roles as roles } from '../../@common/constants/role.constant'
import { Permissions } from 'src/@common/decorators/permissions.decorator';
import { Permissions as permissions } from '../../@common/constants/permission.constant'
import { Events } from 'src/entities/@enums/index.enum';
import { NewPassworAuthenticatedDto } from './dto/new-password-authenticated.dto';
import { RolesGuard } from 'src/@common/guards/roles.guard';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject('CryptoService') private readonly cryptoService,
    private readonly jwtService: JwtService,
    private readonly signupService: SignUpService,
    private readonly loginService: LoginService,
    private readonly passwordService: PasswordService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  @Post('/signup')
  async signup(@Body() body: SignupDto): Promise<ResponseError | ResponseSuccess> {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);
    const response: any = await this.signupService.signup(body);

    if (response.error)
      throw new BadRequestException(response);

    return { success: 'OK', payload: await this.jwtService.sign({ ...response }) }
  }

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<ResponseError | ResponseSuccess> {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);

    const response: any = await this.loginService.login(body);

    if (response.error)
      throw new BadRequestException(response);

    return { success: 'OK', payload: await this.jwtService.sign({ ...response }) }
  }

  @Post('/signup-admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  @Permissions(permissions.ADMIN_USERS)
  async signupAdmin(@Body() body: SignupDto): Promise<ResponseError | ResponseSuccess> {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);

    const response: any = await this.signupService.signupAdmin(body);

    if (response.error)
      throw new BadRequestException(response);

    this.eventEmitter.emit(Events.SignupAdmin, { user: response })

    return { success: 'OK', payload: await this.jwtService.sign({ ...response }) }
  }

  @Post('/login-admin')
  async loginAdmin(@Body() body: LoginDto): Promise<ResponseError | ResponseSuccess> {
    body.email = body.email.toLowerCase()
    body.password = this.cryptoService.encrypt(body.password);

    const response: any = await this.loginService.loginAdmin(body);

    if (response.error)
      throw new BadRequestException(response);

    return { success: 'OK', payload: await this.jwtService.sign({ ...response }) }
  }

  @Get('redirect-app')
  redirect(@Res() res) {
    return res.redirect('exp://192.168.1.11:19000/--/redirect-password');
  }

  @Post('/forgot-password')
  async requestForgotPassword(@Body() body: EmailDto): Promise<ResponseError | ResponseSuccess> {
    body.email = body.email.toLowerCase()
    const response: any = await this.passwordService.forgotPassword(body.email);

    if (response.success) {
      //enviar correo
      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }

  @Post('/new-password')
  async newPassword(@Body() body: NewPasswordDto): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.passwordService.newPassword(body);

    if (response.success) {
      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }

  @Post('/new-password-authenticated')
  @UseGuards(AuthGuard('jwt'))
  async newPasswordIsAuthenticated(
    @Body() body: NewPassworAuthenticatedDto,
    @Req() req
  ): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.passwordService.newPasswordIsAuthenticated(body, req.user);

    if (response.success) {
      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }

  @Post('/change-password')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(roles.ADMIN)
  async changePassword(@Req() req, @Body() body: any): Promise<ResponseError | ResponseSuccess> {
    const response: any = await this.passwordService.changePassword(req.user.id, body);

    if (response.success) {
      return { success: 'OK' }
    } else
      throw new BadRequestException(response);
  }
}
