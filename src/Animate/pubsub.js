/**
 * @module PubSub
 * PubSub
 * @method PubSub
 * @author yanglang
 * @date 20170830
 */

let Events = {};
const toBeNotify = [];
const EVENT_PREFIX = 'TPE';

const PubSub = {
  /*
   * @method notify
   * @param eventName
   * @returns {_}
   */
  notify(eventName, ...rest) {
    const eventList = Events[eventName];
    let i = 0;
    if (eventList) {
      const len = eventList.length;
      for (; i < len; i += 1) {
        eventList[i].apply(this, rest);
      }
    } else {
      toBeNotify.push({
        eventName,
        data: rest,
        scope: this,
      });
    }
    if (eventName.startsWith(`${EVENT_PREFIX}_`)) { this.unsubscribe(eventName); }
    return this;
  },
  /*
   * @param eventName
   * @param scope
   * @param data
   */
  notifyWith(eventName, scope, ...rest) {
    if (arguments.length < 2) { throw new TypeError('arguments error'); }
    this.notify.apply(scope, [eventName].concat(rest));
  },
  /**
   * 触发一个事件
   * @method notify
   * @param eventName 事件名称
   * @param data 事件数据 PS：现在支持变参，除了eventName,data以外还可以添加任意参数
   * @returns {Events}
   */
  notifyLike(eventNamePrefix, ...rest) {
    /* eslint-disable */
    var eventList = [];
    for (var key in Events) {
      new RegExp("^" + eventNamePrefix + ".*$").test(key) && (eventList = eventList.concat(Events[key]));
    }
    let i = 0;
    if (eventList) {
      const len = eventList.length;
      for (; i < len; i++) {
        eventList[i].apply(this, rest);
      }
    }
    return this;
    /* eslint-enable */
  },
  /*
   * @method subscribe
   * @param eventName
   * @param callback
   */
  subscribe(eventName, callback) {
    let i = 0;
    const len = toBeNotify.length;
    if (arguments.length < 2) { throw new TypeError('arguments error '); }

    let eventList = Events[eventName] ? Events[eventName] : (Events[eventName] = []);
    if (Object.prototype.toString.call(callback) === '[object Array]') {
      eventList = eventList.concat(callback);
    } else {
      eventList.push(callback);
    }
    for (; i < len; i += 1) {
      if (toBeNotify[i].eventName === eventName) {
        this.notify.apply(toBeNotify[i].scope, [eventName].concat(toBeNotify[i].data));
        toBeNotify.splice(i, 1);
        break;
      }
    }
    return this;
  },
  /*
   * @method unsubscribe
   * @param eventName
   */
  unsubscribe(eventName, callback) {
    if (callback) {
      const callbacks = Events[eventName];
      for (let i = 0; i < callbacks.length; i += 1) {
        if (callbacks[i] === callback) {
          callbacks.splice(i, 1);
          i -= 1;
        }
      }
    } else { delete Events[eventName]; }
    return this;
  },
  unsubscribeLike(eventNamePrefix){
    for (var key in Events) {
      new RegExp("^" + eventNamePrefix + ".*$").test(key) && (delete Events[key]);
    }
  },
  guid() {
    return 'xxxxxxxx_xxxx_4xxx_yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      /* eslint-disable */
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      /* eslint-enable */
      return v.toString(16);
    });
  },
  /*
   * @method call
   * @param api
   * @param data Object
   * @param alive
   */
  call(api, data, alive) {
    let eventName = '';
    if (data.callback) {
      eventName = !alive ? `${EVENT_PREFIX}_${this.guid()}` : api;
      this.subscribe(eventName, data.callback);
    }
    const messageObj = {
      api,
      action: data.action,
      params: data.params,
      msgId: eventName,
    };
    const message = JSON.stringify(messageObj);

    if (typeof window !== 'undefined') {
      if (typeof window.parent !== 'undefined') {
        window.parent.postMessage(message, '*');
      }
    }

    return this;
  },
};

export default PubSub;
