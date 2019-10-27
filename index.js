let canv = document.getElementById('canvas');
let ctx = canv.getContext('2d');
canv.width = 511;
canv.height = 512;

//canv.width = window.innerWidth;
//canv.height = window.innerHeight;

radio();
changeColor();
changeSize();
//paint();

function radio() {
  let radio = document.getElementsByName('image');
  let radioColl = new Map([
    [radio[0], arrayFirst],
    [radio[1], arraySecond],
    [radio[2], 1]
  ]);

  for (let item of radio) {
    item.addEventListener('click', function () {

      if (item.hasAttribute('checked')) {
        draw(radioColl.get(item));
      } else {
        item.setAttribute('checked', '');
        draw(radioColl.get(item));
      }
    })
  }
}

function changeSize() {
  let width = document.querySelector('.canvas-width');
  let height = document.querySelector('.canvas-height');
  let form = document.querySelector('.canvas-size-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('fuck')
    if (width.value <= 700 && height.value <= 700) {
      canv.width = width.value;
      canv.height = height.value;

    } else if (width.value > 700 || height.value > 700) {
      width.value = 700;
      height.value = 700;
      canv.width = 511;
      canv.height = 512;
    }
  });
}

function draw(arr) {

  let pixel = canv.width / arr.length;
  let x = 0,
    y = 0;

  if (arr === 1) {
    let img = new Image();
    img.src = 'data/image.png';
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canv.width, canv.width);
    }
    return;
  }

  arr.forEach(row => {
    row.forEach(cell => {
      ctx.fillStyle = (typeof cell === "string") ? '#' + cell : 'rgba(' + cell[0] + ', ' + cell[1] +
        ', ' + cell[2] + ', ' + cell[3] + ')';
      ctx.fillRect(x, y, pixel, pixel);
      x += pixel;
    });
    x = 0;
    y += pixel;
  })
}

function changeColor() {
  let colors = document.querySelectorAll('.lower-panel__item');
  let colorsColl = new Map();
  colorsColl.set(colors[0], 'rgb(72, 255, 0)');
  colorsColl.set(colors[1], 'rgb(98, 0, 255)');
  colorsColl.set(colors[2], 'rgb(255, 30, 0)');
  colorsColl.set(colors[3], 'rgb(0, 17, 255)');
  let percent1 = 10,
    percent2 = 20;
  let i = 20;
  for (let item of colors) {

    item.addEventListener('mouseover', function () {
      item.addEventListener('mouseout', function () {
        percent1 = 10;
        percent2 = 20;
        i = 20;
        item.style.background = `linear-gradient(to right, ${colorsColl.get(item)} ${percent1+=4}%, white ${percent2+=7}%)`;

        clearInterval(int);
      });

      let int = setInterval(function () {

        item.style.background = `linear-gradient(to right, ${colorsColl.get(item)} ${percent1+=4}%, white ${percent2+=7}%)`;

        if (percent1 > 40) clearInterval(int);
      }, i -= 1)
    });
  }
}

function paint() {
  let coords = [];
  let mouseDown = false;
  canv.addEventListener('mousedown', function () {

    mouseDown = true;
  })
  canv.addEventListener('mouseup', function () {
    mouseDown = false;
    ctx.beginPath();
  })


  function draw(e) {
    ctx.shadowColor = 'green';
    ctx.shadowBlur = 5;
    ctx.lineWidth = 15;
    ctx.strokeStyle = "green";
    ctx.fillStyle = "green";

    coords.push([e.clientX, e.clientY]);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke()
    ctx.beginPath();
    ctx.arc(e.clientX, e.clientY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY)
  }
  canv.addEventListener('mousemove', function (e) {
    if (mouseDown) {
      draw(e);
    }
  });

  function save() {
    localStorage.setItem('coords', JSON.stringify(coords));
  }

  function replay() {
    let timer = setInterval(function () {
      if (!coords.length) {
        clearInterval(timer);
        ctx.beginPath();
        return;
      }
      let crd = coords.shift();
      let e = {
        clientX: crd["0"],
        clientY: crd["1"]
      };
      draw(e);
    }, 30);

  }

  function clear() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.beginPath();
    ctx.fillStyle = "black"
  }
  document.addEventListener('keydown', function (e) {

    if (e.keyCode == 83) {
      save();
      //save S
      console.log("save it");

    }
    if (e.keyCode == 82) {
      //replay R
      coords = JSON.parse(localStorage.getItem('coords'));
      clear();
      replay();
    }
    if (e.keyCode == 67) {
      // clear C
      clear();

    }
  });
}






/*
let imgDataArray = ctx.getImageData(0,0,canv.width,canvasHeight);
ImageData.data[0] = [255,0,0,255];
mageData.data = [255,0,0,255...[255,1,4,150]]
*/


/*
const xhr = new XMLHttpRequest();
let coords = JSON.parse('data/')
/*
const xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
  const data = this.response;
  drawCanvas(data)
});
xhr.open('GET', 'data/4x4.json');
xhr.send();
*/