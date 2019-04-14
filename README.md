<a href="https://badge.fury.io/js/%40s2terminal%2Fevery-url"><img src="https://badge.fury.io/js/%40s2terminal%2Fevery-url.svg" alt="npm version" height="18"></a>

# Every URL
This is React component that enables to bookmark dynamic url.

## Installation
```bash
$ npm install --save-dev @s2terminal/every-url
```

### Requirements
- [React](https://github.com/facebook/react/)
- [MATERIAL\-UI](https://github.com/mui-org/material-ui)

## Usage
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import EveryURL from "@s2terminal/every-url";

ReactDOM.render(
  <EveryURL
    uniqueStorageKey="EveryURLState"
    urlSettings={
      {
        host: {
          name: "HOST",
          type: "static",
          default: "https://example.com/before/date/path/"
        },
        datePath: {
          name: "DATE",
          type: "date",
          default: "YYYY/MM/DD/"
        },
        afterDatePath: {
          name: "AFTER DATE PATH",
          type: "static",
          default: "after?date=path"
        }
      }
    }
  />, document.getElementById('main'));

```


## Build

```bash
$ npm run prepare
```

## Developing

```bash
$ npm run develop
```
open http://localhost:8080/

## License
[MIT](LICENSE).
