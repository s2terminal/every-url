import React from "react";
import { Card, CardContent, TextField, List, ListItem, Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core/';
import moment from 'moment';

const storageKey = 'EveryURLState';
type PathInfo = any;
interface PageState {
  savedOpen: boolean,
  settingsOpen: boolean,
  urlValues: PathInfo
}

export default class EveryURL extends React.Component<any, PageState> {
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
      window.localStorage.setItem(storageKey, JSON.stringify(unsavedState));
    }
    this.setState({ savedOpen: true });
  }
  loadLocalStorage() {
    if (typeof window !== `undefined`) {
      return JSON.parse(window.localStorage.getItem(storageKey))
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
          <h2>{this.props.settings.general.mainURL}</h2>
          <h3>
            <a href={url} target="_blank">
              {decodeURIComponent(url)}
            </a>
          </h3>
        </section>

        <section>
          <h3>{this.props.settings.general.otherFeature}</h3>
          <h4>{this.props.settings.general.pathSettings}</h4>
          <Button variant="contained" color="primary" onClick={this.handleClickOpenSetting}>
            {this.props.settings.general.pathSettings}
          </Button>
          <h4>{this.props.settings.general.autoRedirect}</h4>
          <p>{this.props.settings.general.autoRedirectDescription}</p>
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
          message={<span>{this.props.settings.general.saved}</span>}
        />

        <Dialog
          fullWidth
          open={this.state.settingsOpen}
          onClose={this.handleSettingClose}
        >
          <DialogTitle>{this.props.settings.general.pathSettings}</DialogTitle>
          <DialogContent>
            <form>
              <List>
                {fieldLists}
              </List>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSettingClose} color="primary" variant="contained" >
              {this.props.settings.general.pathSettings}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent></Card>
    );
  }
}
