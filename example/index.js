import React from 'react';
import ReactDOM from 'react-dom';
import EveryURL from '../src/index.tsx';

ReactDOM.render(
  <EveryURL
    settings={{
      general: {
        mainURL: "TODAY URL",
        otherFeature: "OTHER FEATURE",
        pathSettings: "PATH SETTINGS",
        saved: "SAVED",
        autoRedirect: "AUTO REDIRECT",
        autoRedirectDescription: "To auto redirect, bookmark this url."
      }
    }}
    urlSettings={
      {
        host: {
          name: "HOST",
          type: "static",
          default: "https://example.com/"
        },
        beforeDatePath: {
          name: "BEFORE DATE PATH",
          type: "static",
          default: "before/date/path/"
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
