import Mocha from 'mocha';
import assert from 'assert';
const mocha = new Mocha();
mocha.suite.emit('pre-require', this, 'solution', mocha);
declare const describe: any, it: any, beforeEach: any;

class DB<T> {
  collections: { [key: string]: T[] } = {};

  hasCollection(key: string): boolean {
    return !!this.collections[key];
  }

  hasValue(key: string, value: T): boolean {
    if (!this.hasCollection(key)) {
      return false;
    }

    return this.collections[key].includes(value);
  }

  add(key: string, value: T): string {
    if (!this.hasCollection(key)) {
      this.collections[key] = [value];

      return 'Added';
    }

    if (this.hasValue(key, value)) {
      return 'ERROR, key already exists';
    }

    this.collections[key].push(value);

    return 'Added';
  }

  keys(): string[] {
    return Object.keys(this.collections);
  }

  members(key: string): string {
    if (!this.hasCollection(key)) {
      return 'Key does not exist';
    }

    return this.collections[key].join(',');
  }

  remove(key: string, value: T) {
    if (!this.hasCollection(key)) {
      return 'Key does not exist';
    }

    if (!this.hasValue(key, value)) {
      return 'Value does not exist';
    }

    this.collections[key] = this.collections[key].filter((v) => v !== value);

    if (this.collections[key].length === 0) {
      delete this.collections[key];
    }

    return 'Removed';
  }

  allMembers(): string {
    const collections = this.keys();

    if (collections.length === 0) {
      return 'No collections';
    }

    const members = collections
      .map((key) => {
        return this.members(key)
      })
      .join(',');

    return members;
  }

  allItems(): string {
    const collections = this.keys();

    if (collections.length === 0) {
      return 'No collections';
    }

    const items = collections
      .map((key) => {
        return `${key}: ${this.members(key)}`
      })
      .join(',');

    return items;
  }
}

const db = new DB<string>();

/** Accepts a "command" string and returns an array of output lines. */
function execute(commands: string): string[] {
  const command = commands.split(' ')[0];
  const key = commands.split(' ')[1] || '';
  const value = commands.split(' ')[2] || '';

  console.log({
    command,
    key,
    value,
  })
  const result = executeCommand(command, key, value);

  return [result];
}

const commandMapper = {
    'add': db.add.prototype,
    'remove': db.remove.prototype,
    'members': db.members.prototype,
    'items': db.allItems.prototype,
    'keys': db.keys.prototype,
    'all': db.allMembers.prototype,
}

const executeCommand = (
  command: string,
  key: string,
  value: string
): string => {



    console.log('command', command.toLowerCase())
    const func = commandMapper[command.toLowerCase()];


    if (!func) {
        return `Unknown command: ${command}`;
    }

    console.log('func', func)
    return func(key, value);
//   switch (command.toLowerCase()) {
//     case 'add':
//       return db.add(key, value);

//     case 'keys':
//       return db.keys().join(',');

//     case 'members':
//       return db.members(key);

//     case 'remove':
//       return db.remove(key, value);

//     case 'allmembers':
//       return db.allMembers();

//     case 'allitems':
//         return db.allItems();

//     default:
//       throw new Error(`Unknown command: ${command}`);
//   }
};

describe('set', () => {
  it('can add', () => {
    assert.deepEqual(execute('ADD color blue'), ['Added']);
    assert.deepEqual(execute('ADD color green'), ['Added']);
    assert.deepEqual(execute('ADD color green'), ['ERROR, key already exists']);
  });

//   it('show keys', () => {
//     execute('ADD color blue');
//     execute('ADD numbers 1');
//     execute('ADD images hello.png');
//     assert.deepEqual(execute('KEYS'), ['color,numbers,images']);
//   });

//   it('show members', () => {
//     execute('ADD images example1');
//     execute('ADD images example2');
//     execute('ADD images hello.png');
//     assert.deepEqual(execute('MEMBERS images'), [
//       'hello.png,example1,example2',
//     ]);
//     assert.deepEqual(execute('MEMBERS unknown'), ['Key does not exist']);
//   });

//   it('remove key value', () => {
//     execute('ADD images example1');
//     execute('ADD images example2');
//     execute('ADD images hello.png');
//     assert.deepEqual(execute('REMOVE images hello.png'), ['Removed']);
//     assert.deepEqual(execute('MEMBERS images'), ['example1,example2']);
//     assert.deepEqual(execute('REMOVE images example2'), ['Removed']);
//     assert.deepEqual(execute('MEMBERS images'), ['example1']);
//     assert.deepEqual(execute('REMOVE images example1'), ['Removed']);
//     assert.deepEqual(execute('MEMBERS images'), ['Key does not exist']);
//   });

//   it('allmembers', () => {
//     execute('ADD images example1.png');
//     execute('ADD images example2.png');
//     execute('ADD images hello.png');

//     execute('ADD colors green');
//     execute('ADD colors red');
//     execute('ADD colors blue');

//     execute('ADD fruits apple');
//     execute('ADD fruits orange');
//     execute('ADD fruits banana');

//     assert.deepEqual(execute('ALLMEMBERS'), ['blue,green,1,example1.png,example2.png,hello.png,green,red,blue,apple,orange,banana']);
  
//   });

//   it('allItems', () => {
//     execute('ADD images example1.png');
//     execute('ADD images example2.png');
//     execute('ADD images hello.png');

//     execute('ADD colors green');
//     execute('ADD colors red');
//     execute('ADD colors blue');

//     execute('ADD fruits apple');
//     execute('ADD fruits orange');
//     execute('ADD fruits banana');

//     assert.deepEqual(execute('ALLITEMS'), ['color: blue,green,numbers: 1,images: example1.png,example2.png,hello.png,colors: green,red,blue,fruits: apple,orange,banana']);
  
//   });
  beforeEach(() => {});
});

mocha.run();
