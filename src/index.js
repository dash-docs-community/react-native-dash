var getData = require('./getData');
var Sequelize = require('sequelize');

// to see the relevant doc pages we crawl, check indexedFiles.json

// db ops
var sequelize = new Sequelize('database', null, null, {
  dialect: 'sqlite',
  storage: __dirname + '/../Contents/Resources/docSet.dsidx',
});

var searchIndex = sequelize.define(
  'searchIndex',
  {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: Sequelize.STRING},
    type: {type: Sequelize.STRING},
    path: {type: Sequelize.STRING},
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

searchIndex.sync().then(function() {
  var data = getData();
  console.log(data)
  data.forEach(function(header) {
    var si = searchIndex.build({
      name: header.name,
      type: header.type,
      path: header.path
    });
    si.save();
  });
});
