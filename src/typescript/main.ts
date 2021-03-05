import { sayHello } from "./greet";
class Home {
    constructor() { }

    getMsg(name: string) {
        return sayHello(name);
    }
}

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    const cls = new Home();
    elt.innerText = cls.getMsg(`${name}, I really don't like the export and import`);
}

showHello("greeting", "TypeScript");
