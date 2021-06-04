import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
  port: +process.env.PORT,
  prefix: process.env.APP_URL_PREFIX,
  hostServer: process.env.NODE_ENV === 'local' ?
    `${process.env.APP_HOST_SERVER}:${+process.env.PORT}` : process.env.APP_HOST_SERVER,
  hostClient: process.env.APP_HOST_CLIENT
}))