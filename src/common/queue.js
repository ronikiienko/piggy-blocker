import {wait} from './utils';


export class Queue {
    queue = [];
    inProcess = false;

    constructor(callback) {
        this.callback = callback;
    }

    async #launchQueue() {
        if (!this.queue.length) {
            this.inProcess = false;
            return;
        }
        this.inProcess = true;
        await this.callback(this.queue[0]);
        this.queue.shift();
        await this.#launchQueue();
    }

    push(queueItem) {
        this.queue.push(queueItem);
        if (!this.inProcess) {
            this.#launchQueue().catch(console.log);
        }
    }

    clear() {
        this.queue = [];
        this.inProcess = false;
    }
    getQueue() {
        return this.queue
    }
}

const queueCallback = async (params) => {
    await wait(2000);
    console.log('function....', params);
};

// const myQueue = new Queue(queueCallback);
// myQueue.push({robot: '1'});
// myQueue.push({robot: '2'});
// myQueue.push({robot: '3'});
// myQueue.push({robot: '4'});
// myQueue.push({robot: '5'});
// wait(3000)
//     .then(() => myQueue.clear())

