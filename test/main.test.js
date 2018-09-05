import handles from 'handlebars';
import read from '../src/read_template';
import traverse from '../src/traverse';
import parse from '../src/main';

it('test', () => {
  console.log(JSON.stringify(traverse(module)));
});

it('test handlebars', () => {
  console.log(
    handles.compile(read('snapshotgun-es6.template'))({
      executePath: 'yolo',
      testName: 'test',
      files: {
        asd: {
          path: 'whatever'
        },
        dhasd: {
          path: 'lel'
        }
      }
    })
  );
});
