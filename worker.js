const { createClient } = require('redis');
const { processImage } = require('./src/processImages');
const { promisifyAll } = require('./src/promisify');

const client = createClient({ db: 1 });
const methods = ['rpop', 'hgetall', 'hmset'];
promisifyAll(client, methods);

const runLoop = async () => {
  try {
    const id = await client.rpop('ipQueue');
    const job = await client.hgetall(`job_${id}`);
    const tags = await processImage(job);
    const image = ['tags', JSON.stringify(tags)];
    await client.hmset(`job_${id}`, image.concat('status', 'completed'));
    console.log('finished job', id);
    runLoop();
  } catch (error) {
    setTimeout(runLoop, 1000);
  }
};

runLoop();
