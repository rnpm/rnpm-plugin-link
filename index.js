module.exports = [{
  func: require('./src/link'),
  description: 'Links all native dependencies',
  name: 'link [packageName]',
  options: [{
    flags: '-s, --skip [platform]',
    description: 'Skip linking for platform (android or ios)',
    default: '',
  }],
}, {
  func: require('./src/unlink'),
  description: 'Unlink native dependency',
  name: 'unlink <packageName>',
}];
