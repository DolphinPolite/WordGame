const body = document.getElementById("body");
const panel = document.getElementsByClassName("panel")[0];
const allStuff = document.getElementsByClassName("allStuff")[0];
const playForm = document.getElementsByClassName("PlayForm")[0];
const Settings = document.getElementsByClassName("Settings")[0];
const HowToPlay = document.getElementsByClassName("HowToPlay")[0];
const formMarginLeft = "90vw";
let started = true;

function PlayGameHover() {
    const text = document.getElementById("btnText1");
    text.style.width = "10vw";
    text.style.border = "3px solid #333";
    text.style.padding = "0px 20px 65px 50px"
    body.style.backgroundColor = "#2ECC40"
};

function LeaveGameHover() {
    const text = document.getElementById("btnText1");
    text.style.width = "14vw";
    text.style.border = "3px solid #333";
    text.style.padding = "0px 20px 65px 50px"
    body.style.backgroundColor = "#FF4136"
};

function SettingHover() {
    const text = document.getElementById("btnText2");
    text.style.width = "13vw"
    text.style.border = "3px solid #333";
    text.style.padding = "0px 20px 65px 50px"
    body.style.backgroundColor = "#0074D9"
};

function HowToPlayHover() {
    const text = document.getElementById("btnText3");
    text.style.width = "20vw"
    text.style.border = "3px solid #333";
    text.style.padding = "0px 20px 65px 50px"
    body.style.backgroundColor = "#FFDC00"
};

function LeaveGameUnhover() {
    const text = document.getElementById("btnText1");
    text.style.border = "none";
    text.style.padding = "0px"
    text.style.width = "0vw"
    body.style.backgroundColor = "#2ECC40"
};

function PlayGameUnhover() {
    const text = document.getElementById("btnText1");
    text.style.border = "none";
    text.style.padding = "0px"
    text.style.width = "0vw"
};

function SettingUnhover() {
    const text = document.getElementById("btnText2");
    text.style.border = "none";
    text.style.padding = "0px"
    text.style.width = "0vw"
};

function HowToPlayUnhover() {
    const text = document.getElementById("btnText3");
    text.style.border = "none";
    text.style.padding = "0px"
    text.style.width = "0vw"
};

function pullAside() {

    if (started)
    {
        Settings.style.marginLeft,HowToPlay.style.marginLeft,playForm.style.marginLeft = formMarginLeft,formMarginLeft,formMarginLeft;
        started = false;
    }

    allStuff.style.marginLeft = "0vw"
    panel.style.width = "25vw"
}

function pullMiddle() {
    allStuff.style.marginLeft = "40vw"
    panel.style.width = "0vw"
}

function PlayMode() {
    const values = IsThereAnyForm();

    if (values[0]) {
        pullMiddle();
        playForm.style.width = "0px";
        playForm.style.marginLeft = formMarginLeft;
    }
    else {
        playForm.style.width = "100%";
        playForm.style.marginLeft = "15vw";
        Settings.style.width = "0px";
        Settings.style.marginLeft = formMarginLeft;
        HowToPlay.style.width = "0px";
        HowToPlay.style.marginLeft = formMarginLeft;
    }
}

function SettingsMode() {
    const values = IsThereAnyForm();

    if (values[1]) {
        pullMiddle();
        Settings.style.width = "0px";
        Settings.style.marginLeft = formMarginLeft;
    }
    else {
        playForm.style.width = "0px";
        playForm.style.marginLeft = formMarginLeft;
        Settings.style.width = "100%";
        Settings.style.marginLeft = "15vw";
        HowToPlay.style.width = "0px";
        HowToPlay.style.marginLeft = formMarginLeft;
    }
}

function HowToPlayMode() {
    const values = IsThereAnyForm();

    if (values[2]) {
        pullMiddle();
        HowToPlay.style.width = "0px";
        HowToPlay.style.marginLeft = formMarginLeft;
    }
    else {
        playForm.style.width = "0px";
        playForm.style.marginLeft = formMarginLeft;
        Settings.style.width = "0px";
        Settings.style.marginLeft = formMarginLeft;
        HowToPlay.style.width = "100%";
        HowToPlay.style.marginLeft = "15vw";
    }
}

function IsThereAnyForm() {
    /*
        Buradaki olay şu
        formlar var mı yok mu marginLeft sayesinde kontrol edilir. Eğer marginLeft değişirse uğraşmayalım diye formMarginLeft değeri ile kontrol yapılır.
        0. index playForm formu duruyor mu diye kontrol eder
        1. index Settings formu duruyor mu diye kontrol eder
        2. index HowToPlay formu duruyor mu diye kontrol eder
    */ 
   console.log(playForm.style.marginLeft, Settings.style.marginLeft, HowToPlay.style.marginLeft)
    return [playForm.style.marginLeft != formMarginLeft, Settings.style.marginLeft != formMarginLeft, HowToPlay.style.marginLeft != formMarginLeft];
}