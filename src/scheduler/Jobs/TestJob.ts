import JobBase from '../JobBase';
import logging from '@common_logging';

class TestJob extends JobBase {
  getId(): string {
    return 'TestJob';
  }

  async handler() {
    try {
      ll(this.getId(), 'start');

      //

      ll(this.getId(), 'complete');
    } catch (err) {
      logging.err(this.getId(), (err as Error).toString());
    }
  }
}

export default TestJob;
