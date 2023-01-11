import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Analytics, track } from './react';

describe('<Analytics />', () => {
  afterEach(() => cleanup());

  describe('in development mode', () => {
    it('should add the script tag correctly', () => {
      render(<Analytics mode="development" />);

      // eslint-disable-next-line testing-library/no-node-access
      const scripts = document.getElementsByTagName('script');
      expect(scripts).toHaveLength(1);

      // eslint-disable-next-line testing-library/no-node-access
      const script = document.head.querySelector('script');

      if (!script) {
        throw new Error('Could not find script tag');
      }

      expect(script.src).toEqual(
        'https://cdn.vercel-insights.com/v1/script.debug.js',
      );
      expect(script).toHaveAttribute('defer');
    });
  });

  describe('in production mode', () => {
    it('should add the script tag correctly', () => {
      render(<Analytics mode="production" />);

      // eslint-disable-next-line testing-library/no-node-access
      const scripts = document.getElementsByTagName('script');
      expect(scripts).toHaveLength(1);

      // eslint-disable-next-line testing-library/no-node-access
      const script = document.head.querySelector('script');

      if (!script) {
        throw new Error('Could not find script tag');
      }

      expect(script.src).toEqual('http://localhost/_vercel/insights/script.js');
      expect(script).toHaveAttribute('defer');
    });
  });

  describe('track  custom events', () => {
    beforeEach(() => {
      // reset the internal queue before every test
      window.vaq = [];
    });
    describe('queue custom events', () => {
      it('event name only', () => {
        render(<Analytics mode="production" />);

        track('my event');

        expect(window.vaq).toBeDefined();

        if (!window.vaq) throw new Error('window.vaq is not defined');

        expect(window.vaq[0]).toEqual([
          'track',
          {
            name: 'my event',
          },
        ]);
      });
      it('with custom data', () => {
        render(<Analytics mode="production" />);

        track('custom event', {
          string: 'string',
          number: 1,
        });

        expect(window.vaq).toBeDefined();

        if (!window.vaq) throw new Error('window.vaq is not defined');

        expect(window.vaq[0]).toEqual([
          'track',
          {
            name: 'custom event',
            data: {
              string: 'string',
              number: 1,
            },
          },
        ]);
      });

      it('strip nested object', () => {
        process.env = {
          NODE_ENV: 'production',
        };
        render(<Analytics mode="production" />);

        track('custom event', {
          string: 'string',
          number: 1,
          // @ts-expect-error ignore for test
          nested: {
            object: '',
          },
        });

        expect(window.vaq).toBeDefined();

        if (!window.vaq) throw new Error('window.vaq is not defined');

        expect(window.vaq[0]).toEqual([
          'track',
          {
            name: 'custom event',
            data: {
              string: 'string',
              number: 1,
            },
          },
        ]);
      });
    });
  });
});
