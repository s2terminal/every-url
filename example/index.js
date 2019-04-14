import React from 'react';
import ReactDOM from 'react-dom';
import EveryURL from '../src/index.tsx';

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
