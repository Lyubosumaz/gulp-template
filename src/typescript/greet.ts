import { Home } from './main';

export function sayHello(name: string) {
    return `Hello from ${name}`;
}

let a = new Home();
a.getMsg();