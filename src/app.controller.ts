import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'
import * as XLSX from 'xlsx';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(@Res() res: Response) {
    let fileName = 'test1.xlsx'

    var array = [
      { name: 'Moran', role: 'back' },
      { name: 'Alain', role: 'front' },
      { name: 'Tony', role: 'back' },
      { name: 'Mike', role: 'back' },
      { name: 'Abo', role: 'back' },
      { name: 'Toni', role: 'back' },
    ]

    /* let data = array.map(i => {
      return [i.name, i.role]
    })

    var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['NAME', 'ROLE'],
      ...data
    ]); */
    var ws = XLSX.utils.json_to_sheet([
      { S: 1, h: 2, e: 3, e_1: 4, t: 5, J: 6, S_1: 7 },
      { S: 2, h: 3, e: 4, e_1: 5, t: 6, J: 7, S_1: 8 }
    ]);
    var wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    var buf = XLSX.writeFile(wb, fileName, { bookType: 'xlsx' })

    res.download(fileName, 'test1.xlsx')
  }
}
