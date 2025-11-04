import { randomUUID } from 'crypto';
import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

import express from 'express';

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use(express.json());

// 커스텀 헤더에서 워커 인덱스를 추출하는 미들웨어
app.use((req, res, next) => {
  const workerIndex = req.headers['x-worker-index'];
  if (workerIndex !== undefined) {
    req.workerIndex = parseInt(workerIndex, 10);
  }
  next();
});

const getDbName = (req) => {
  if (process.env.TEST_ENV !== 'e2e') {
    return 'realEvents.json';
  }

  const workerIndex = req.workerIndex;
  if (workerIndex === undefined) {
    throw new Error('Worker index not found in request');
  }
  return `e2e-worker-${workerIndex}.json`;
};

const getEvents = async (req) => {
  const dbName = getDbName(req);
  const data = await readFile(`${__dirname}/src/__mocks__/response/${dbName}`, 'utf8');

  return JSON.parse(data);
};

app.post('/__test__/reset', (req, res) => {

  if (process.env.TEST_ENV !== 'e2e') {
    res.status(400).send('잘못된 요청입니다.');
  }

  const dbName = getDbName(req);
  fs.writeFileSync(`${__dirname}/src/__mocks__/response/${dbName}`, JSON.stringify({ events: [] }));
  res.status(200).send('Reset complete');
});

app.post('/__test__/seed', async (req, res) => {
  try {
    const seedFile = `${__dirname}/src/__mocks__/response/seed.json`;

    if (!fs.existsSync(seedFile)) {
      return res.status(404).send('Seed file not found');
    }

    const dbName = getDbName(req);
    const seedData = fs.readFileSync(seedFile, 'utf-8');
    fs.writeFileSync(`${__dirname}/src/__mocks__/response/${dbName}`, seedData);

    res.status(200).send('Seed applied');
  } catch (err) {
    console.error('Seed failed:', err);
    res.status(500).send('Seed failed');
  }
});

app.get('/api/events', async (req, res) => {
  const events = await getEvents(req);
  res.json(events);
});

app.post('/api/events', async (req, res) => {
  const events = await getEvents(req);
  const newEvent = { id: randomUUID(), ...req.body };

  const dbName = getDbName(req);
  fs.writeFileSync(
    `${__dirname}/src/__mocks__/response/${dbName}`,
    JSON.stringify({
      events: [...events.events, newEvent],
    })
  );

  res.status(201).json(newEvent);
});

app.put('/api/events/:id', async (req, res) => {
  const events = await getEvents(req);
  const id = req.params.id;
  const eventIndex = events.events.findIndex((event) => event.id === id);
  if (eventIndex > -1) {
    const newEvents = [...events.events];
    newEvents[eventIndex] = { ...events.events[eventIndex], ...req.body };

    const dbName = getDbName(req);
    fs.writeFileSync(
      `${__dirname}/src/__mocks__/response/${dbName}`,
      JSON.stringify({
        events: newEvents,
      })
    );

    res.json(events.events[eventIndex]);
  } else {
    res.status(404).send('Event not found');
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const events = await getEvents(req);
  const id = req.params.id;

  const dbName = getDbName(req);
  fs.writeFileSync(
    `${__dirname}/src/__mocks__/response/${dbName}`,
    JSON.stringify({
      events: events.events.filter((event) => event.id !== id),
    })
  );

  res.status(204).send();
});

app.post('/api/events-list', async (req, res) => {
  const events = await getEvents(req);
  const repeatId = randomUUID();
  const newEvents = req.body.events.map((event) => {
    const isRepeatEvent = event.repeat.type !== 'none';
    return {
      id: randomUUID(),
      ...event,
      repeat: {
        ...event.repeat,
        id: isRepeatEvent ? repeatId : undefined,
      },
    };
  });

  const dbName = getDbName(req);
  fs.writeFileSync(
    `${__dirname}/src/__mocks__/response/${dbName}`,
    JSON.stringify({
      events: [...events.events, ...newEvents],
    })
  );

  res.status(201).json(newEvents);
});

app.put('/api/events-list', async (req, res) => {
  const events = await getEvents(req);
  let isUpdated = false;

  const newEvents = [...events.events];
  req.body.events.forEach((event) => {
    const eventIndex = events.events.findIndex((target) => target.id === event.id);
    if (eventIndex > -1) {
      isUpdated = true;
      newEvents[eventIndex] = { ...events.events[eventIndex], ...event };
    }
  });

  if (isUpdated) {
    const dbName = getDbName(req);
    fs.writeFileSync(
      `${__dirname}/src/__mocks__/response/${dbName}`,
      JSON.stringify({
        events: newEvents,
      })
    );

    res.json(events.events);
  } else {
    res.status(404).send('Event not found');
  }
});

app.delete('/api/events-list', async (req, res) => {
  const events = await getEvents(req);
  const newEvents = events.events.filter((event) => !req.body.eventIds.includes(event.id)); // ? ids를 전달하면 해당 아이디를 기준으로 events에서 제거

  const dbName = getDbName(req);
  fs.writeFileSync(
    `${__dirname}/src/__mocks__/response/${dbName}`,
    JSON.stringify({
      events: newEvents,
    })
  );

  res.status(204).send();
});

app.put('/api/recurring-events/:repeatId', async (req, res) => {
  const events = await getEvents(req);
  const repeatId = req.params.repeatId;
  const updateData = req.body;

  const seriesEvents = events.events.filter((event) => event.repeat.id === repeatId);

  if (seriesEvents.length === 0) {
    return res.status(404).send('Recurring series not found');
  }

  const newEvents = events.events.map((event) => {
    if (event.repeat.id === repeatId) {
      return {
        ...event,
        title: updateData.title || event.title,
        description: updateData.description || event.description,
        location: updateData.location || event.location,
        category: updateData.category || event.category,
        notificationTime: updateData.notificationTime || event.notificationTime,
        repeat: updateData.repeat ? { ...event.repeat, ...updateData.repeat } : event.repeat,
      };
    }
    return event;
  });

  const dbName = getDbName(req);
  fs.writeFileSync(
    `${__dirname}/src/__mocks__/response/${dbName}`,
    JSON.stringify({ events: newEvents })
  );

  res.json(seriesEvents);
});

app.delete('/api/recurring-events/:repeatId', async (req, res) => {
  const events = await getEvents(req);
  const repeatId = req.params.repeatId;

  const remainingEvents = events.events.filter((event) => event.repeat.id !== repeatId);

  if (remainingEvents.length === events.events.length) {
    return res.status(404).send('Recurring series not found');
  }

  const dbName = getDbName(req);
  fs.writeFileSync(
    `${__dirname}/src/__mocks__/response/${dbName}`,
    JSON.stringify({ events: remainingEvents })
  );

  res.status(204).send();
});

app.listen(port, () => {
  // 테스트 환경이 아닐 때만 기본 DB 파일 생성
  if (process.env.TEST_ENV !== 'e2e') {
    const dbPath = `${__dirname}/src/__mocks__/response/realEvents.json`;
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ events: [] }));
    }
  }
  console.log(`Server running at http://localhost:${port}`);
});
