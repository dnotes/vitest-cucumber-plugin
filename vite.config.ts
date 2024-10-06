import quickpickle from '.';

export default {
  plugins: [quickpickle()],
  test: {
    include : [ 'features/*.feature', 'tests/*.test.ts' ],
  },
  resolve: {
    alias: {
      'quickpickle': __dirname + '/dist/index',
    }
  }
};
