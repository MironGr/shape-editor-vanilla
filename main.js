const svg = document.querySelector('.svg')
const svgNS = "http://www.w3.org/2000/svg"
const svgXY = svg.getBoundingClientRect()

const onPoint = new CustomEvent('onPoint')

function addPoint () {
  svg.addEventListener('click', clickSVG)
}

addPoint()

function clickSVG (e) {
  const points = svg.querySelectorAll('.point-start')

  const circle = document.createElementNS(svgNS, 'circle')
  circle.setAttributeNS(null, 'cx', (e.clientX - svgXY.left))
  circle.setAttributeNS(null, 'cy', (e.clientY - svgXY.top))
  circle.setAttributeNS(null, 'r', '8')
  circle.setAttributeNS(null, 'class', 'point-start')

  if (!points.length) {

    // создание path
    const pathNew = document.createElementNS(svgNS, 'path')
    pathNew.setAttributeNS(null, 'class', 'path-create')
    pathNew.setAttributeNS(null, 'd', `M ${(e.clientX - svgXY.left)} ${e.clientY - svgXY.top}`)
    // style для возможности редактирования
    pathNew.setAttributeNS(null, 'fill', '#61D89F')
    pathNew.setAttributeNS(null, 'stroke', '#FF9700')
    pathNew.setAttributeNS(null, 'stroke-width', '5')

    svg.append(pathNew)
    svg.append(circle)  

  } else if (points.length) {
    const path = svg.querySelector('.path-create')
    const point = svg.querySelector('.point-start')

    const dPath = path.getAttributeNS(null, 'd')
    // добавление новых линий к path
    path.setAttributeNS(null, 'd', `${dPath} L ${(e.clientX - svgXY.left)} ${e.clientY - svgXY.top}`)

    // обработчик для начальной точки
    point.dispatchEvent(onPoint)
    point.addEventListener('onPoint', hundleClickPoint)
  }
}

function hundleClickPoint () {
  const path = document.querySelector('.path-create')
  const dPath = path.getAttributeNS(null, 'd')

  this.addEventListener('click', () => {
    this.remove()

    const x = this.getAttributeNS(null, 'cx')
    const y = this.getAttributeNS(null, 'cy')
    path.setAttributeNS(null, 'd', `${dPath} L ${x} ${y}`)
    path.setAttributeNS(null, 'class', 'path-ready')
    
    // удалить обработчик
    svg.removeEventListener('click', clickSVG)

    // возможность редактировать заливку, обводку и толщину
    updateStyle('add-fill', 'type-fill', 'fill')
    updateStyle('add-stroke', 'type-stroke', 'stroke')
    updateStyle('add-width', 'type-width', 'stroke-width')
  })
}

function updateStyle(btnClass, inputClass, prop) {
  const btn = document.querySelector(`.${btnClass}`)

  btn.addEventListener('click', () => {
    const path = document.querySelector('.path-ready')
    const value = document.querySelector(`.${inputClass}`).value
    path.setAttributeNS(null, `${prop}`, value)
  })
}