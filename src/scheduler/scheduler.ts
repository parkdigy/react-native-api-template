// import schedule from './schedule';
// import { TestJob } from './Jobs';
import { Scheduler } from './scheduler.types';

const scheduler: Scheduler = {
  $jobs: [],
  $start() {
    this.$jobs.forEach((j) => {
      ll('cancel');
      j.cancel();
    });
    this.$jobs = [];
    if (process.env.APP_ENV !== 'local') {
      // ll('job start');
      // this.$jobs.push(schedule.minutely(new TestJob()));
    }
  },
};

export default scheduler;
