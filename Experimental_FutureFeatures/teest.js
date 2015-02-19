var a = "asdf;asdf;asdf;";
var arr = [];
var a = a.split(/;/);
console.log(a);
a.forEach(function (pius) {
    arr.concat(pius);
    console.log(arr);
}
