import {
  ClientOptions,
  buildRequestUrl,
  createQuickApiClient,
  buildQueryParams,
} from '.';

describe('quickApiClient', () => {
  let options: ClientOptions = {};

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

      describe('with default query params', () => {
        it('merges the query params', () => {
          options.defaultQueryParams = { test1: 'hello' };
          const url = buildRequestUrl(options, 'items', { test2: 'hey' });
          expect(url).toEqual(`${options.baseUrl}/items?test1=hello&test2=hey`);
        });
      });

      describe('with conflicting default query params', () => {
        it('prefers the request query param', () => {
          options.defaultQueryParams = { test1: 'hello', test2: 'hi' };
          const url = buildRequestUrl(options, 'items', { test1: 'hey' });
          expect(url).toEqual(`${options.baseUrl}/items?test1=hey&test2=hi`);
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

  describe('buildQueryParams', () => {
    describe('with normal params', () => {
      it('returns the correct query string', () => {
        const queryParams = { test: 'hey', test2: 'hi' };
        const queryString = buildQueryParams(options, queryParams);
        expect(decodeURI(queryString!)).toEqual('test=hey&test2=hi');
      });
    });

    describe('with default query params', () => {
      it('returns the correct query string', () => {
        options.defaultQueryParams = { test: 'hey' };
        const queryParams = { test2: 'hi' };
        const queryString = buildQueryParams(options, queryParams);
        expect(decodeURI(queryString!)).toEqual('test=hey&test2=hi');
      });
    });

    describe('with default query params that conflict with query params', () => {
      it('returns the correct query string', () => {
        options.defaultQueryParams = { test: 'hey', test2: 'aloha' };
        const queryParams = { test2: 'hi' };
        const queryString = buildQueryParams(options, queryParams);
        expect(decodeURI(queryString!)).toEqual('test=hey&test2=hi');
      });
    });

    describe('with only default query params', () => {
      it('returns the correct query string', () => {
        options.defaultQueryParams = { test: 'hey', test2: 'hi' };
        const queryString = buildQueryParams(options);
        expect(decodeURI(queryString!)).toEqual('test=hey&test2=hi');
      });
    });

    describe('with query params containing []', () => {
      it('returns the correct query string', () => {
        const queryParams = { 'test[]': ['hi', 'hello', 'hey'] };
        const queryString = buildQueryParams(options, queryParams);
        expect(decodeURI(queryString!)).toEqual(
          'test[]=hi&test[]=hello&test[]=hey',
        );
      });
    });

    describe('with query params and default query params containing []', () => {
      it('returns the correct query string', () => {
        options.defaultQueryParams = { 'test[]': ['hi', 'hello'], test2: 'yo' };
        const queryParams = { 'test[]': ['hello', 'hey'] };
        const queryString = buildQueryParams(options, queryParams);
        expect(decodeURI(queryString!)).toEqual(
          'test[]=hello&test[]=hey&test2=yo',
        );
      });
    });
  });
});
