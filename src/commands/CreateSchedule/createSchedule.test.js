const createSchedule = require('./createSchedule');

test('createSchedule command should return a schedule object', () => {
  const schedule = createSchedule();
  expect(schedule).toBeDefined();
  expect(typeof schedule).toBe('object');
});

test('createSchedule command should have the correct properties', () => {
  const schedule = createSchedule();
  expect(schedule).toHaveProperty('title');
  expect(schedule).toHaveProperty('date');
  expect(schedule).toHaveProperty('time');
});

test('createSchedule command should set the correct values for properties', () => {
  const schedule = createSchedule();
  expect(schedule.title).toBe('New Schedule');
  expect(schedule.date).toBe('2022-01-01');
  expect(schedule.time).toBe('09:00 AM');
});