

let name = "List";
let info = "hello world";
let m = `i am ${name} ${info}`;
console.log(m);  //i am List hello world


function fn(...arg){
    for(let v of arg){
        console.log(v);
    }
}
fn(1,2,3,4);

let arr = v => v*2;
console.log(arr(2));
/*
* 暂不支持编译，缺少一个polyfill.js文件来支持
* */
let tell = function* (){
    yield 'a';
    yield 'b';
    return 'c';
}
let k = tell();
console.log(k.next()); //{value: "a", done: false}
console.log(k.next()); //{value: "b", done: false}
console.log(k.next()); //{value: "c", done: true}
console.log(k.next()); //{value: undefined, done: true}