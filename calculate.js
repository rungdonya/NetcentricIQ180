/**
 * Created by apple on 11/3/2016 AD.
 */

var num = [];
var qu = " ";
var clicked= false;
var clknum1 =false;
var clknum2 = false;
var clknum3 = false;
var clknum4 = false;
var clknum5 = false;
var prob;
var text="";
var sum,quest,temp;



function start() {
    if (clicked == false) {

        for(i=0;i<5;i++){
            num[i] = Math.floor((Math.random() * 9)+1);

            if(i==0){
                sum = num[i];
            }else {
                var op = Math.floor((Math.random() * 4) + 1);
                if (op == 1) {
                    sum += num[i];
                } else if (op == 2) {
                    sum -= num[i];
                } else if (op == 3) {
                    sum *= num[i];
                } else {
                    temp = sum;
                    sum /= num[i];
                    if(sum%num[i]==0) {
                        quest += "/" + num[i];
                    }else{
                        sum =temp;
                        i--;
                    }
                }
            }
            clicked = true;
        }
        if(sum>=100||sum<=0){
            clicked=false;
            reset();
        }
        document.getElementById("realans").innerHTML = sum;
        document.getElementById("num1").innerHTML = num[0];
        document.getElementById("num2").innerHTML = num[1];
        document.getElementById("num3").innerHTML = num[2];
        document.getElementById("num4").innerHTML = num[3];
        document.getElementById("num5").innerHTML = num[4];
    }
}
function  reset() {
    qu = ""
    document.getElementById("ans").value = qu;
    clicked = false;
    start();
}
function check(){
    var input = document.getElementById("ans").value;
    var num=0;
    console.log(input);
    var inputarray =[];
    for(i=0;i<input.length;i++){
        inputarray[i]=input.substring(i,i+1);
        if(inputarray[i].localeCompare(document.getElementById("num1").innerHTML)==0||inputarray[i].localeCompare(document.getElementById("num2").innerHTML)==0||inputarray[i].localeCompare(document.getElementById("num3").innerHTML)==0||inputarray[i].localeCompare(document.getElementById("num4").innerHTML)==0||inputarray[i].localeCompare(document.getElementById("num5").innerHTML)==0){
            num++;
        }
    }
    console.log(num)
    if(num<5){
        alert("Please use all the values we given!!")
    }else if(num==5){
        if(eval(input)==document.getElementById("realans").innerHTML){
            alert("CORRECT!!!")
            reset();
        }else{
            alert("WRONG!!!")
        }
    }else {
        alert("Please use each value once!!")
    }

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
