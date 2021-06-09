import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/user/permission.entity';
import { Repository } from 'typeorm';

const PERMISSIONS = [
  { key: 'admin_users', name: 'Administrar usuarios' }
]

export class PermissionDefault {
  constructor(
    @InjectRepository(Permission) private readonly repository: Repository<Permission>
  ) {
    PERMISSIONS.map(permission => this.create(permission))
  }

  async create(_object){
    const isExist = await this.repository.findOne({ where: { key: _object.key }})
    
    if(isExist)
      return 
    
    const _new = this.repository.create(_object)

    return this.repository.save(_new)
  }
}
