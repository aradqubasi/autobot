 function Cache() {
    this.ports = [];
    this.onportopen = (port) => {};
    this.onportclose = (port) => {};

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


    this.signalists = {};
    this.signalists['user2'] = {
        id: '8a912335-f16a-4cfa-9899-062cb8f32a3a',
        user: 'user2',
        password: 'Aa@11111'
    };
    this.signalists['user'] = {
        id: 'a3e25c6a-7416-46b2-a377-643404b4249f',
        user: 'user',
        password: 'p@$$word'
    };;
    // this.onsignalists = (signalists) => {};

    this.token = 'eHlqUl1lXl1Efm5';
    this.ontokenupdate = (token) => { }
    // setTimeout(() => {
    //     this.token = 'eHlqUl1lXl1Efm5';
    //     this.ontokenupdate('eHlqUl1lXl1Efm5');
    // }, 9000);

    this.subscriptions = {};
    this.subscriptions['a3e25c6a-7416-46b2-a377-643404b4249f'] = {
        signalistId: 'a3e25c6a-7416-46b2-a377-643404b4249f'
    };

    this.currency = 'USD';

    this.lot = 1;

    this.botId = 'd8f3e120-ba1c-4553-9f64-f9e8c48528eb';
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