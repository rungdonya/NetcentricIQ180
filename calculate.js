/**
 * Created by apple on 11/3/2016 AD.
 */

var qu = " ";
var clicked= false;
var clknum1 =false;
var clknum2 = false;
var clknum3 = false;
var clknum4 = false;
var clknum5 = false;
var text="";
var finished=false;



function start(data) {

    document.getElementById("realans").innerHTML = data.sum;
    document.getElementById("num1").innerHTML = data.num[0];
    document.getElementById("num2").innerHTML = data.num[1];
    document.getElementById("num3").innerHTML = data.num[2];
    document.getElementById("num4").innerHTML = data.num[3];
    document.getElementById("num5").innerHTML = data.num[4];

}
function  reset() {
    qu = ""
    document.getElementById("ans").value = qu;
    clicked = false;
    start();
}

function plus() {
    text+="+";
    document.getElementById('ans').value = text;
}
function minus() {
    text+="-";
    document.getElementById('ans').value = text;
}
function multiply() {
    text+="*";
    document.getElementById('ans').value = text;
}
function divide() {
    text+="/";
    document.getElementById('ans').value = text;
}
function brac1() {
    text+="(";
    document.getElementById('ans').value = text;
}
function brac2() {
    text+=")";
    document.getElementById('ans').value = text;
}


function num1() {
    if (clknum1 == false) {
        text += document.getElementById("num1").innerHTML;
        document.getElementById('ans').value = text;
        clknum1 = true;
    }else{
        text = text.replace(document.getElementById("num1").innerHTML,"");
        document.getElementById('ans').value = text;
        clknum1 =false;
    }
}
function num2() {
    if (clknum2 == false) {
        text += document.getElementById("num2").innerHTML;
        document.getElementById('ans').value = text;
        clknum2 = true;
    }else{
        text = text.replace(document.getElementById("num2").innerHTML,"");
        document.getElementById('ans').value = text;
        clknum2 =false;
    }
}
function num3() {
    if (clknum3 == false) {
        text += document.getElementById("num3").innerHTML;
        document.getElementById('ans').value = text;
        clknum3 = true;
    }else{
        text = text.replace(document.getElementById("num3").innerHTML,"");
        document.getElementById('ans').value = text;
        clknum3 =false;
    }
}
function num4() {
    if (clknum4 == false) {
        text += document.getElementById("num4").innerHTML;
        document.getElementById('ans').value = text;
        clknum4 = true;
    }else{
        text = text.replace(document.getElementById("num4").innerHTML,"");
        document.getElementById('ans').value = text;
        clknum4 =false;
    }
}
function num5() {
    if (clknum5 == false) {
        text += document.getElementById("num5").innerHTML;
        document.getElementById('ans').value = text;
        clknum5 = true;
    }else{
        text = text.replace(document.getElementById("num5").innerHTML,"");
        document.getElementById('ans').value = text;
        clknum5 =false;
    }
}
