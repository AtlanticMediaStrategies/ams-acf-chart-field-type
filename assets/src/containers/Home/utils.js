const LEFT_EDGE = 80
const fontFamily = 'allstate-sans, sans-serif'

function parseSVG(fabric, svg, canvas, graph, offsetTop) {
  return new Promise(resolve => {

    const { parseSVGDocument, Group } = fabric

    const g = new Group()

    parseSVGDocument(svg, (layers) => {
      layers.forEach(layer => {
        if(graph.type === 'bar' && layer.text) {
          if(layer.fill === 'white') {
            layer.setTop(layer.getTop() + 12)
          } else {
            layer.setTop(layer.getTop() - 10)
          }
        }
        g.add(layer)
      })
      g.setTop(offsetTop)
      g.setLeft(LEFT_EDGE)
      canvas.add(g)
      resolve(canvas)
    })
  })
}

function parseMultiSvgs(fabric, svgs, canvas, offsetTop) {
  const { Group, Text } = fabric
  let height, width, ratio, parentWidth
  return new Promise(resolve => {
    const parses = []
    Array.from(svgs).forEach(svg => {
      width = parseInt(svg.getAttribute('viewBox').split(' ')[2])
      height = parseInt(svg.getAttribute('viewBox').split(' ')[3])
      parentWidth = svg.parentNode.offsetWidth
      ratio =  parentWidth / width
      parses.push(new Promise(layerResolve => {
        fabric.parseSVGDocument(svg, layerResolve)
      }))
    })
    if(width < (1024 / svgs.length) - 40) {
      width = (1024 / svgs.length) - 40
      ratio = width / parentWidth
      height = width
    }
    Promise.all(parses).then(all_layers => {
      all_layers.forEach((layers, i) => {
        const p = svgs[i].parentNode.querySelector('p').textContent
        const g = new Group()
        layers.forEach(layer => {
          if(layer.text) {
            layer.setFontSize(36)
            layer.setTop(layer.getTop() - 16)
          }
          g.add(layer)
        })
        const pElm= new Text(p, {
          fontSize: 36,
          fontFamily
        })
        pElm.setTop(450)
        g.add(pElm)
        pElm.setLeft((width / 2) - (pElm.getWidth() / 2))
        if(svgs.length > 1) {
          g.setScaleX(ratio)
          g.setScaleY(ratio)
        }
        g.setTop((canvas.getHeight() / 2) - (height / 2) - 18)
        const left = (svgs.length === 1) ?
            (canvas.getWidth() / 2) - (width / 2) :
            ((1024 / svgs.length) * i) + 40
        g.setLeft(left)
        canvas.add(g)
        resolve(canvas)
      })
    })
  })
}

function fetchImage(fabric, canvas, url) {
  return new Promise(resolve => {
    fabric.Image.fromURL(url, (img) => {
      img.setTop(canvas.getHeight() - img.getHeight() - 20)
      img.setLeft(canvas.getWidth() - img.getWidth() - 20)
      canvas.add(img)
      resolve(canvas)
    })
  })
}

export async function parse_graph(fabric, svg, graph, parent) {

  const {
    Canvas,
    Image,
    Text,
    Rect
  } = fabric;


  const subtitle =
    parent.querySelector('div[data-name="subtitle"] input').value

  const source =
    parent
      .querySelector('div[data-name="source"] input')
      .value

  let can = new Canvas();

  let viewbox = svg.getAttribute('viewBox')
  viewbox = viewbox.split(/\s+/)

  const width = parseInt(viewbox[2])
  const height = parseInt(viewbox[3])

  can.setWidth(1024)
  can.setHeight(1024)
  can.setBackgroundColor('white')

  const {
    type,
    data,
    active_rows,
    colors
  } = graph

  const titleElement = new fabric.Textbox(graph.title, {
    fill: '#E12C8A',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily,
    width: 1004
  })
  titleElement.setTop(20)
  titleElement.setLeft(20)
  can.add(titleElement)

  const subtitleElement = new fabric.Textbox(subtitle, {
    fill: '#2F353E',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily,
    width: 1004
  })

  subtitleElement.setTop(titleElement.getTop() + titleElement.getHeight() + 8)
  subtitleElement.setLeft(20)
  can.add(subtitleElement)

  // generate legend
  let offsetTop = subtitleElement.getTop() + subtitleElement.getHeight() + 8
  active_rows.forEach((row, i) => {
    if(row === true && i > 0) {
      const color = colors[i]
      const label = data[i][0]

      const rect = new Rect({
        fill: color,
        width: 16,
        height: 16
      })
      rect.setTop(offsetTop)
      rect.setLeft(20)
      can.add(rect)

      const text = new fabric.Textbox(label, {
        fontFamily,
        fontSize: 14,
        lineheight: 16,
        width: 900
      })
      text.setLeft(50)
      text.setTop(offsetTop)
      can.add(text)

      // increment for next row
      offsetTop += text.getHeight() + 10
    }
  })

  offsetTop -= 35 // reset offsetTop

  if(type === 'pie') {
    const svgs = parent.querySelectorAll('svg')
    can = await parseMultiSvgs(fabric, svgs, can, offsetTop)
  } else {
    can = await parseSVG(fabric, svg, can, graph, offsetTop)
  }

  const sourceElement = new Text(`Source: ${source}`, {
    fill: '#A5B3BE',
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily
  })
  sourceElement.setLeft(20)
  sourceElement.setTop(can.getHeight() - 40)
  can.add(sourceElement)

  can =
    await fetchImage(fabric,
                     can,
                     '/wp-content/themes/renewal-project/img/export-logo.png')

  return Promise.resolve(can.toDataURL())
}
