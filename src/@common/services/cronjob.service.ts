import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import moment = require('moment');

@Injectable()
export class CronJobService {
  constructor(
    private scheduler: SchedulerRegistry
  ) { }

  async createCronJob(name: string, pattern: string, callback) {
    try {
      const job = new CronJob(pattern, callback)
      this.scheduler.addCronJob(name, job)
      job.start();
    } catch (error) {
      console.log("ERROR CREATE CRONJOB", error)
    }
  }

  async deleteCronJob(name) {
    try {
      this.scheduler.deleteCronJob(name)
    } catch (error) {
      console.log("ERROR DELETE CRONJOB")
    }
  }

  async getCronJobs() {
    const jobs = this.scheduler.getCronJobs();
    return await new Promise((resolve, reject) => {
      let res = []
      jobs.forEach((value, key, map) => {
        try {
          res.push({ key, next: value.nextDates().format(), cronTime: value.cronTime.source })
        } catch (error) {
          console.log("ERROR", error)
        }
      })
      resolve(res)
    })
  }

  async getCronjobTime(date) {
    const mi = moment(date).format('mm')
    const h = moment(date).format('HH')
    const d = moment(date).format('DD')
    const mo = moment(date).format('MM')

    let cron = `0 ${mi} ${h} ${d} ${Number(mo) - 1} *`
    console.log('cron-time', cron)
    return cron
  }
}