export default {
  path: '/api/people',
  response: function (req, res, next) {
    return { moo: this.foo }
  },
  foo: 'bar'
}
