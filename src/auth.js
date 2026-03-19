export default {
  login(account, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }
    insecureRequest(account, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) cb(true);
        this.onChange(true);
      } else {
        if (cb) cb(false);
        this.onChange(false);
      }
    });
  },

  getToken() {
    return localStorage.token;
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  onChange() {}
};

function munge(t) {
  console.log(t.slice(3, 7) + t.slice(0, 3) + t.slice(7));
  return t.slice(3, 7) + t.slice(0, 3) + t.slice(7);
}

function insecureRequest(account, pass, cb) {
  setTimeout(() => {
    if (account === "gvdteam2022" && pass === munge(account)) {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      });
    } else {
      cb({ authenticated: false });
    }
  }, 0);
}
