const express = require('express');
const redis = require('redis');
const { promisifyAll } = require('./src/promisify');

const PORT = 3000;
const app = express();
client = redis.createClient({ db: 1 });

const methods = ['incr', 'hmset', 'hgetall', 'lpush'];
promisifyAll(client, methods);

app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.get('/status/:id', async (req, res) => {
  try {
    const image = await client.hgetall(`job_${req.params.id}`);
    res.send(image);
  } catch (error) {
    res.status(404).write('Not found');
  }
});

const getImage = (options) => {
  const keys = Object.keys(options);
  return keys.reduce((image, key) => {
    image.push(key, options[key]);
    return image;
  }, []);
};

app.post('/process/:name/:count/:width/:height/:tags', async (req, res) => {
  try {
    const imageSet = getImage(req.params);
    imageSet.push('receivedAt', new Date().toISOString());
    const id = await client.incr('currId');
    await client.hmset(`job_${id}`, imageSet.concat('status', 'scheduled'));
    await client.lpush('ipQueue', id);
    res.send({ id });
  } catch (error) {
    res.status(500).send('Some thing went wrong');
  }
});

app.listen(PORT, () => console.log('server is on ', PORT));
