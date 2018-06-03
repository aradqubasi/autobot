 const config = require('./config.js').cache
 const initials = require('./config.js').cache.initial
 
 function Cache() {
    this.ports = [4568];
    this.onportopen = (port) => {};
    this.onportclose = (port) => {};

    this.signalists = {}
    if (config.useConfigAsInitialValues) {
        this.signalists = initials.signalists
    }
    else {
        this.signalists['user2'] = {
            id: '8a912335-f16a-4cfa-9899-062cb8f32a3a',
            user: 'user2',
            password: 'Aa@11111'
        }
        this.signalists['user'] = {
            id: 'a3e25c6a-7416-46b2-a377-643404b4249f',
            user: 'user',
            password: 'p@$$word'
        }
    }

    this.token = ''
    if (config.useConfigAsInitialValues) {
        this.token = initials.token
    }
    else {
        this.token = 'eHlqUl1lXl1Efm5'
    }
    this.ontokenupdate = (token) => { }

    this.subscriptions = {}
    if (config.useConfigAsInitialValues) {
        this.subscriptions = initials.subscriptions
    }
    else {
        this.subscriptions['a3e25c6a-7416-46b2-a377-643404b4249f'] = {
            signalistId: 'a3e25c6a-7416-46b2-a377-643404b4249f'
        }
    }

    this.currency = ''
    if (config.useConfigAsInitialValues) {
        this.currency = initials.currency
    }

    this.lot = 0
    if (config.useConfigAsInitialValues) {
        this.lot = initials.lot
    }

    this.botId = ''
    if (config.useConfigAsInitialValues) {
        this.botId = initials.botId
    }
 }

Cache.prototype.onPortOpen = function (callback) {
    this.onportopen = callback;
}

Cache.prototype.onPortClose = function (callback) {
    this.onportclose = callback;
}

Cache.prototype.onTokenUpdate = function (callback) {
    this.ontokenupdate = callback;
}

module.exports = Cache;

    // setInterval(() => {
    //     this.ports = [4568]
    //     this.onportopen(4568);
    // }, 10000);
    // setTimeout(() => {
    //     setInterval(() => {
    //         this.ports = [4568, 4569]
    //         this.onportopen(4569);
    //     }, 10000);
    // }, 3000);
    // setTimeout(() => {
    //     setInterval(() => {
    //         this.ports = [4569]
    //         this.onportclose(4568);
    //     }, 10000);
    // }, 6000);
    // setTimeout(() => {
    //     setInterval(() => {
    //         this.ports = []
    //         this.onportclose(4569);
    //     }, 10000);
    // }, 9000);

        // setTimeout(() => {
    //     this.token = 'eHlqUl1lXl1Efm5';
    //     this.ontokenupdate('eHlqUl1lXl1Efm5');
    // }, 9000);