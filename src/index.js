import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,

} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDJ-7ViLdxdO3Rj07xZvDJ-72hD5qQeewg",
    authDomain: "dab-dab-dab.firebaseapp.com",
    projectId: "dab-dab-dab",
    storageBucket: "dab-dab-dab.appspot.com",
    messagingSenderId: "246415720016",
    appId: "1:246415720016:web:3521bbdbd0e846045ddb55"
 };

initializeApp(firebaseConfig);

const db = getFirestore();

const colRefDistance = collection(db, "distance");
const colRefDuration = collection(db, "duration");
const colRefEnergy = collection(db, "energy");
const colRefSperms = collection(db, "sperms");
const colRefWeight = collection(db, "weight");
const colRefCaught = collection(db, "caught");

var ft = 2.5; //feet
var hr = 0.0667; //hours
var cals = 125; // gram calories
var sc = 250000000;
var kg = 0.003; //kilograms
var rr = 1/400; // rate of getting caught red handed. Source? experience.

const keysArray = ["distance", "hours", "cals", "count", "kg", "times"];
const valuesArray = [colRefDistance, colRefDuration, colRefEnergy, colRefSperms, colRefWeight, colRefCaught];



async function getComparison(i) {
  let snapshot = await getDocs(valuesArray[i]);
  let comparisonsArray = [];

  snapshot.docs.forEach((doc) => {
    comparisonsArray.push({...doc.data()});
  });


  return comparisonsArray;
}

let dataArray = [];

async function getAllComparisons() {
  let promises = keysArray.map((_, index) => getComparison(index));
  dataArray = await Promise.all(promises);
  return dataArray
}


// Sorting Data
async function sortData() {
  let arrays = await getAllComparisons();

  //!  "Use map, ForEach is old ~ TypeScript" 
  // arrays.forEach((arr, index) => {
  //   let key = keysArray[index];
  //   arr.sort((a, b) => a[key] - b[key]);
  // });  

  arrays.map((arr, index) => {
    let key = keysArray[index];
    arr.sort((a, b) => a[key] - b[key]);
  })

  return arrays
}

// DOM ELEMENTS

const indexHero = document.querySelector(".hero")
const statHero = document.querySelector(".stat_hero")

const loader = document.querySelector(".loader");

const toggle = document.querySelectorAll(".toggle")
const body = document.body;

const retry = document.querySelector(".retry")
const submit = document.querySelector(".submit")
const input = document.querySelector(".input")

const pop = new Audio();
pop.src = "./audio/pop2.mp3"
const on = new Audio();
on.src = "./audio/on.mp3"
const off = new Audio();
off.src = "./audio/off.mp3"
const enter = new Audio();
enter.src = "./audio/enter.mp3"

retry.addEventListener("click", () => {

  pop.play();

  indexHero.classList.remove("banished")
  statHero.classList.add("banished")

  loader.classList.add("banished");
  loader.classList.remove("loader--hidden");

  hiddenElements.forEach((el) => {
    el.classList.remove("show")
  })
 
})

var clicked = false;

submit.addEventListener("click", () =>{
  pop.play();
  submit.style.transform = "translateY(4px)";
  submit.addEventListener("transitionend", () => {
  submit.style.transform = "translateY(0px)";
  clicked = true;
  })
} )


input.addEventListener("focus", () => {
  if(clicked == true){
    clicked = false;
  }else{
    enter.play()
    clicked = true;
  }
})


// Initialize the theme based on the current preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  body.classList.add('dark');
} else {
  body.classList.add('light');
}

// Add event listener to each toggle switch
toggle.forEach((el) => {
  el.addEventListener('change', () => {
    if (el.checked) {
      body.classList.remove('dark');
      body.classList.add('light');
      on.play();
    } else {
      body.classList.remove('light');
      body.classList.add('dark');
      off.play();
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
    // else {
    //   entry.target.classList.remove("show");
    // }
  });
});

hiddenElements.forEach((el) => observer.observe(el));


const ej_span = document.querySelector("#ej_value")
const sperm_span = document.querySelector("#sperm_value")
const hours_span = document.querySelector("#hours_value")
const distance_span = document.querySelector("#distance_value")
const kg_span = document.querySelector("#kg_value")
const cal_span = document.querySelector("#cal_value")
const watt_span = document.querySelector("#watt_value")
const sperm_comprison_span = document.querySelector("#sperm_comparison")
const hours_comprison_span = document.querySelector("#hours_comparison")
const distance_comprison_span = document.querySelector("#distance_comparison")
const kg_comprison_span = document.querySelector("#weight_comparison")
const energy_comprison_span = document.querySelector("#energy_comparison")
const caught_comprison_span = document.querySelector("#caught_comparison")
const ej_p = document.querySelector(".ej_p");
const sperm_p = document.querySelector(".sperm_p");
const duration_p = document.querySelector(".duration_p");
const distance_p = document.querySelector(".distance_p");
const weight_p = document.querySelector(".weight_p");
const energy_p = document.querySelector(".energy_p");


const comparisonElements = [distance_comprison_span, hours_comprison_span, energy_comprison_span, sperm_comprison_span, kg_comprison_span, caught_comprison_span]

const form = document.querySelector(".form");


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
let totalFt = form.count.value * ft
let totalHr = parseFloat((form.count.value * hr).toFixed(1));
let totalCals = form.count.value * cals
let totalWatt =  parseFloat((totalCals / 860.4).toFixed(1))
let totalSc = form.count.value * sc
let totalKg = parseFloat((form.count.value * kg).toFixed(2));
let totalRr = Math.round(form.count.value * rr)

let distComparison = [];
let durComparison = [];
let enerComparison = [];
let scComparison = [];
let weightComparison = [];
let caughtComparison = [];

let totalUserStats = [totalFt, totalHr, totalCals, totalSc, totalKg, totalRr]
let outputArray = [distComparison, durComparison, enerComparison, scComparison, weightComparison, caughtComparison];

ej_span.innerHTML = form.count.value;
sperm_span.innerHTML = totalSc;
hours_span.innerHTML = totalHr;
distance_span.innerHTML = totalFt;
kg_span.innerHTML = totalKg;
cal_span.innerHTML = totalCals;
watt_span.innerHTML= totalWatt;

  
async function compareData(totalUserStats, outputArray){
  let array = await sortData();
  array.forEach((arr, index) => {
   arr.map((item) => {
    if(
      totalUserStats[index] >= item[`${keysArray[index]}`]
    ){
      outputArray[index].push(item.comparison)
    }
    })
    console.log(outputArray[index][outputArray[index].length - 1])
  })
  return outputArray
}

  // compareData(totalUserStats, outputArray)

  async function addComparisons(comparisonElements){
    let comparisons = await compareData(totalUserStats, outputArray);
    console.log(comparisons)

    comparisons.forEach((item, index) => {
      comparisonElements[index].innerHTML = item[item.length - 1];
    })

    indexHero.classList.add("banished")
    statHero.classList.remove("banished")
   
  }


  if( form.count.value == 0){

    ej_p.innerHTML = "You have beaten your meat <b>0</b> times. You truly are the chaddest of all chads."
    sperm_p.innerHTML = "You total sperm count is <b>zero</b>. Coincidentally, that's the number of girlfriends I have."
    duration_p.innerHTML = "You have spent <b>0</b> hours masturbating a.k.a ruining your social life, physical health and emotional stability.";
    distance_p.innerHTML = "The combined distance of your ejaculations is <b>0</b> ft. That's the difference between 5'11\" and 6 ft.";
    weight_p.innerHTML = "You have produced <b>0</b> kg of semen, which is exactly the amount of weight I can lift without any trouble.";
    energy_p.innerHTML = "You haven't used any energy to masturbate while masturbating. That's the amount of energy a rock uses in its lifetime."
    caught_comprison_span.innerHTML = "You haven't been caught masturbating because you can't get caught masturbating if you don't masturbate 😏"
    indexHero.classList.add("banished")
    statHero.classList.remove("banished")
  }else{
    addComparisons(comparisonElements)
  }

  loader.classList.remove("banished");
  setTimeout(() => {
    loader.classList.add("loader--hidden");
    }, 3000);



  form.reset();

});



