import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeAll(() => {
    logger = new JsonLogger();

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should format to JSON without params', () => {
    const formatted = logger.formatMessage('LOG', 'Test');
    expect(JSON.parse(formatted)).toEqual({
      level: 'LOG',
      message: 'Test',
      optionalParams: [],
    });
  });

  it('should format to JSON with params', () => {
    const formatted = logger.formatMessage('LOG', 'Test', { key: 'value' });
    expect(JSON.parse(formatted)).toEqual({
      level: 'LOG',
      message: 'Test',
      optionalParams: [{ key: 'value' }],
    });
  });

  it('should log INFO message to console.log', () => {
    logger.log('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'INFO',
        message: 'message',
        optionalParams: [{ user: 'test' }],
      }),
    );
  });

  it('should log FATAL message to console.log', () => {
    logger.fatal('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'FATAL',
        message: 'message',
        optionalParams: [{ user: 'test' }],
      }),
    );
  });

  it('should log ERROR message to console.log', () => {
    logger.error('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'ERROR',
        message: 'message',
        optionalParams: [{ user: 'test' }],
      }),
    );
  });

  it('should log WARN message to console.log', () => {
    logger.warn('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'WARN',
        message: 'message',
        optionalParams: [{ user: 'test' }],
      }),
    );
  });

  it('should log DEBUG message to console.log', () => {
    logger.debug('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'DEBUG',
        message: 'message',
        optionalParams: [{ user: 'test' }],
      }),
    );
  });

  it('should log VERBOSE message to console.log', () => {
    logger.verbose('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'VERBOSE',
        message: 'message',
        optionalParams: [{ user: 'test' }],
      }),
    );
  });
});
