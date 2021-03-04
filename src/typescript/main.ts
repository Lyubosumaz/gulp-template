import { sayHello } from "./greet";
function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}
showHello("greeting", "TypeScript");

export class Home {
    constructor() { }

    getMsg() {
        console.log("this is class print");
    }
}