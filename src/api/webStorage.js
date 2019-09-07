export const webStorage={
    setLocal: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    getLocal: function(key) {
        return window.localStorage.getItem(key);
    },
    setSession: function(key, value) {
        window.sessionStorage.setItem(key, value);
    },
    getSession: function(key) {
        return window.sessionStorage.getItem(key);
    },
    clearOneLocal: function(key) {
        window.localStorage.removeItem(key);
    },
    clearOneSession: function(key) {
        window.sessionStorage.removeItem(key);
    },
    clearAllLocal: function() {
        window.localStorage.clear();
    },
    clearAllSession: function() {
        window.sessionStorage.clear();
    }
}