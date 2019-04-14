import React from "react";
import { Card, CardContent, TextField, List, ListItem, Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/';
import moment from 'moment';

type PathInfo = { [key: string]: string };
interface EveryURLState {
  savedOpen: boolean,
  settingsOpen: boolean,
  urlValues: PathInfo
}

interface URLSetting {
  name: string,
  type: string,
  default: string
}
interface EveryURLProps {
  uniqueStorageKey?: string,
  settings?: {
    mainURL: string,
    otherFeature: string,
    pathSettings: string,
    saved: string,
    autoRedirect: string,
    autoRedirectDescription: string
  },
  urlSettings: { [key: string]: URLSetting }
}

export default class EveryURL extends React.Component<EveryURLProps, EveryURLState> {
  constructor (props) {
    super(props);
    this.fieldListItem = this.fieldListItem.bind(this);
    this.saveLocalStorage = this.saveLocalStorage.bind(this);

    const loadedState = this.loadLocalStorage();
    if (loadedState) {
      this.state = loadedState;
      this.autoRedirect();
    } else {
      this.state.settingsOpen = true;
    }
  }

  static defaultProps = {
    uniqueStorageKey: "EveryURLState",
    settings: {
      mainURL: "TODAY URL",
      otherFeature: "OTHER FEATURE",
      pathSettings: "PATH SETTINGS",
      saved: "SAVED",
      autoRedirect: "AUTO REDIRECT",
      autoRedirectDescription: "To auto redirect, bookmark this url."
    }
  }

  state = {
    savedOpen: false,
    settingsOpen: false,
    urlValues: this.defaultValues()
  }

  defaultValues() {
    const defaultValues = {};
    for (let key of Object.keys(this.props.urlSettings)) {
      defaultValues[key] = this.props.urlSettings[key].default;
    }
    return defaultValues;
  }

  generateURL(date = new Date()): string {
    let urlString = "";
    for (let key of Object.keys(this.props.urlSettings)) {
      switch (this.props.urlSettings[key].type) {
        case 'date':
          urlString += moment(date).format(this.state.urlValues[key]);
          break;
        case 'static':
        default:
          urlString += this.state.urlValues[key];
          break;
      }
    }

    return urlString;
  }
  generateAutoRedirectURL(): string {
    if (typeof window !== `undefined`) {
      const url = new URL(window.location.href);
      url.searchParams.set("redirect", "yes");
      return url.toString();
    }

    return "";
  }

  handleChange = (name: keyof PathInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState((prevState) => {
      prevState.urlValues[name] = value;
      return prevState;
    });
  };

  saveLocalStorage() {
    const unsavedState = this.state;
    unsavedState.savedOpen = false;
    unsavedState.settingsOpen = false;
    if (typeof window !== `undefined`) {
      window.localStorage.setItem(this.props.uniqueStorageKey, JSON.stringify(unsavedState));
    }
    this.setState({ savedOpen: true });
  }
  loadLocalStorage() {
    if (typeof window !== `undefined`) {
      return JSON.parse(window.localStorage.getItem(this.props.uniqueStorageKey))
    }
  }

  autoRedirect() {
    if (typeof window !== `undefined`) {
      const parsedUrl = new URL(window.location.href);
      if (parsedUrl.searchParams.get("redirect") != "yes") { return; }
      window.location.href = this.generateURL().toString();
    }
  }

  handleSettingClose = () => {
    this.setState({ settingsOpen: false });
    this.saveLocalStorage();
  };
  handleSnackClose = () => {
    this.setState({ savedOpen: false });
  };
  handleClickOpenSetting = () => {
    this.setState({ settingsOpen: true });
  };

  fieldListItem (props: {pathKey: keyof PathInfo}) {
    return (
      <ListItem>
        <TextField
          style={{ margin: 8 }}
          fullWidth
          label={this.props.urlSettings[props.pathKey].name}
          value={this.state.urlValues[props.pathKey]}
          placeholder={this.props.urlSettings[props.pathKey].default}
          onChange={this.handleChange(props.pathKey)}
        />
      </ListItem>
    );
  }

  render() {
    const url = this.generateURL();
    const redirectBookmarkUrl = this.generateAutoRedirectURL();

    const fieldLists = Object.keys(this.props.urlSettings).map((key) => {
      return (
        <this.fieldListItem key={key} pathKey={key} />
      );
    });

    return (
      <Card><CardContent>
        <section>
          <h2>{this.props.settings.mainURL}</h2>
          <h3>
            <a href={url} target="_blank">
              {decodeURIComponent(url)}
            </a>
          </h3>
        </section>

        <section>
          <h3>{this.props.settings.otherFeature}</h3>
          <h4>{this.props.settings.pathSettings}</h4>
          <Button variant="contained" color="primary" onClick={this.handleClickOpenSetting}>
            {this.props.settings.pathSettings}
          </Button>
          <h4>{this.props.settings.autoRedirect}</h4>
          <p>{this.props.settings.autoRedirectDescription}</p>
          <TextField
            fullWidth
            value={redirectBookmarkUrl}
            InputProps={{ readOnly: true }}
          />
        </section>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.savedOpen}
          autoHideDuration={1000}
          onClose={this.handleSnackClose}
          message={<span>{this.props.settings.saved}</span>}
        />

        <Dialog
          fullWidth
          open={this.state.settingsOpen}
          onClose={this.handleSettingClose}
        >
          <DialogTitle>{this.props.settings.pathSettings}</DialogTitle>
          <DialogContent>
            <form>
              <List>
                {fieldLists}
              </List>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSettingClose} color="primary" variant="contained" >
              {this.props.settings.pathSettings}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent></Card>
    );
  }
}
