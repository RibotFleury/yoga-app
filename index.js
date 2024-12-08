//alert("connected");

/* ----les variables à pointer----- */

// la variable main
const main = document.querySelector("main");
//console.log(main);

const basicArray = [
  {
    pic: 0,
    min: 1,
  },
  {
    pic: 1,
    min: 1,
  },
  {
    pic: 2,
    min: 1,
  },
  {
    pic: 3,
    min: 1,
  },
  {
    pic: 4,
    min: 1,
  },
  {
    pic: 5,
    min: 1,
  },
  {
    pic: 6,
    min: 1,
  },
  {
    pic: 7,
    min: 1,
  },
  {
    pic: 8,
    min: 1,
  },
  {
    pic: 9,
    min: 1,
  },
];

let exerciceArray = [];

// faire du local pour cette fonction qui se lance lorsqu'on lance la page

(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = basicArray;
  }
})();

// ici c'est la classe qui va créer les exercice de l'utilisateur
class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }

  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        this.index++;
        this.ring();

        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 100);

    return (main.innerHTML = `
    <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="./img/${exerciceArray[this.index].pic}.png">
        <div>${this.index + 1}/${exerciceArray.length}</div>
    </div>
    `);
  }

  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

// la variables utils va contenir toutes les fonctions utiles au projet

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  //stocker le nombre de minutes
  handleEventMinutes: function () {
    document.querySelectorAll('input[type = "number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        //console.log(e);
        exerciceArray.map((exo) => {
          //console.log("test");
          if (exo.pic == e.target.id) {
            //console.log("yes");
            exo.min = parseInt(e.target.value);
            //console.log(exerciceArray);
            this.store();
          }
        });
      });
    });
  },

  // changer la position d'un exercice
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        console.log(e);
        let position = 0;
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            //console.log("yes");

            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            //console.log(exerciceArray);
            page.lobby();
            this.store();
          } else {
            position++;
            //console.log(position);
          }
        });
      });
    });
  },

  // supprimer un exercice dans la liste des exercice
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        //console.log(e);
        let newArr = [];
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            newArr.push(exo);
          }
        });
        exerciceArray = newArr;
        page.lobby();
        this.store();
        //console.log(exerciceArray);
      });
    });
  },

  //remettre à jour
  reboot: function () {
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },

  // fonction qui permet de stocker les choses à chaque fois que l'array evolue
  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
};

// qui va contenir nos pages: parametrage, routine, terminée
const page = {
  lobby: function () {
    let mapArray = exerciceArray
      .map(
        (exo) =>
          `
        <li>
        <div class="card-header">
            <input type="number" id = ${exo.pic} min ="1" max="10" value=${exo.min}>
            <span>min</span>
        </div>
        <img src="./img/${exo.pic}.png">
        <i class="fas fa-arrow-alt-circle-left arrow" data-pic = ${exo.pic}></i>
        <i class = "fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
    </li>
        `
      )
      .join("");

    utils.pageContent(
      "Paramétrage <i id='reboot' class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Commencer <i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => this.routine());
  },

  routine: function () {
    const exercice = new Exercice();
    utils.pageContent("Routine", exercice.updateCountdown(), null);
  },

  finish: function () {
    utils.pageContent(
      "C'est terminé !",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinitialiser <i class='fas fa-rimes-circle'></i></button>"
    );
    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => utils.reboot());
  },
};

page.lobby();
