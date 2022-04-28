import {
  IClientOptions,
  buildRequestUrl,
  createQuickApiClient,
} from '.';

describe('quickApiClient', () => {
  let options: IClientOptions = {};

  afterEach(() => {
    options = {};
  });

  describe('createApiClient', () => {
    it('creates an API client', () => {
      options = { baseUrl: 'https://example.com' };
      const client = createQuickApiClient(options);
      expect(client).toHaveProperty('get');
    });
  });

  describe('buildRequestUrl', () => {
    beforeEach(() => {
      options = { baseUrl: 'https://example.com/api' };
    });

    describe('with query params', () => {
      it('returns the correct URL', () => {
        const url = buildRequestUrl(options, 'items', { test: 'hey' });
        expect(url).toEqual(`${options.baseUrl}/items?test=hey`);
      });

      describe('when endpoint ends in ?', () => {
        it('returns the correct URL', () => {
          const url = buildRequestUrl(options, 'items?', { test: 'hey' });
          expect(url).toEqual(`${options.baseUrl}/items?test=hey`);
        });
      });

      describe('when the endpoint has existing query params', () => {
        it('returns the correct URL', () => {
          const url = buildRequestUrl(options, 'items?param1=1', {
            test: 'hey',
          });
          expect(url).toEqual(`${options.baseUrl}/items?param1=1&test=hey`);
        });

        describe('when endpoint ends in &', () => {
          it('returns the correct URL', () => {
            const url = buildRequestUrl(options, 'items?param1=1&', {
              test: 'hey',
            });
            expect(url).toEqual(`${options.baseUrl}/items?param1=1&test=hey`);
          });
        });
      });

      describe('when endpoint ends in /', () => {
        it('returns the correct URL', () => {
          const url = buildRequestUrl(options, 'items/', { test: 'hey' });
          expect(url).toEqual(`${options.baseUrl}/items?test=hey`);
        });
      });
    });

    describe('without query params', () => {
      it('returns the correct URL', () => {
        const url = buildRequestUrl(options, 'items');
        expect(url).toEqual(`${options.baseUrl}/items`);
      });

      describe('when endpoint contains query params', () => {
        it('returns the correct URL', () => {
          const url = buildRequestUrl(options, 'items?test=hey');
          expect(url).toEqual(`${options.baseUrl}/items?test=hey`);
        });
      });
    });
  });
});
