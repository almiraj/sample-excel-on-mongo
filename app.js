const fs = require('fs');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

const Schema = mongoose.Schema;
const TemplateModel = (function() {
  const Schema = mongoose.Schema;
  return mongoose.model('Template', new Schema({
    name: { type: String },
    template: { type: Buffer }
  }, {
    usePushEach: true
  }));
})();

if (process.argv[2] == 'write') {
  fs.readFile('src.xlsx', (e, content) => {
    TemplateModel.update({ name: 'src.xlsx' }, { name: 'src.xlsx', template: content }, { upsert: true })
      .then(result => {
        console.log(result);
        mongoose.disconnect();
      })
      .catch(e => {
        console.log(e);
        mongoose.disconnect();
      });
  });
} else if (process.argv[2] == 'read') {
  TemplateModel.findOne({ name: 'src.xlsx'})
    .then(result => {
      if (!result) {
        return Promise.reject('Not Found');
      }
      console.log(result);
      fs.writeFile('dest.xlsx', result.template, e => {
        console.log(e);
        mongoose.disconnect();
      })
    })
    .catch(e => {
      console.log(e);
      mongoose.disconnect();
    });
} else {
  console.log('USAGE: npm start [write|read]');
  mongoose.disconnect();
}
