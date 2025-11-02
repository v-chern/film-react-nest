import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeAll(() => {
    logger = new TskvLogger();

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should format to TSKV without params', () => {
    const formatted = logger.formatMessage('LOG', 'Test');
    expect(formatted).toBe('level=LOG\tmessage=Test');
  });

  it('should format to TSKV with params', () => {
    const formatted = logger.formatMessage('LOG', 'Test', { key: 'value' });
    expect(formatted).toBe('level=LOG\tmessage=Test\tparams=[{"key":"value"}]');
  });

  it('should log INFO message to console.log', () => {
    logger.log('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      'level=INFO\tmessage=message\tparams=[{"user":"test"}]',
    );
  });

  it('should log FATAL message to console.log', () => {
    logger.fatal('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      'level=FATAL\tmessage=message\tparams=[{"user":"test"}]',
    );
  });

  it('should log ERROR message to console.log', () => {
    logger.error('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      'level=ERROR\tmessage=message\tparams=[{"user":"test"}]',
    );
  });

  it('should log WARN message to console.log', () => {
    logger.warn('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      'level=WARN\tmessage=message\tparams=[{"user":"test"}]',
    );
  });

  it('should log DEBUG message to console.log', () => {
    logger.debug('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      'level=DEBUG\tmessage=message\tparams=[{"user":"test"}]',
    );
  });

  it('should log VERBOSE message to console.log', () => {
    logger.verbose('message', { user: 'test' });
    expect(console.log).toHaveBeenCalledWith(
      'level=VERBOSE\tmessage=message\tparams=[{"user":"test"}]',
    );
  });
});
