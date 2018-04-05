const colors = [
  '#00FFFF',
  '#00FF15',
  '#FF0000',
  '#4800FF',
  '#FFFF00',
  '#ff00d6',
  '#4800FF',
  '#4bc6fb',
  '#FF8000',
]

const layerTypes = [
  {
    id: 'left-psoas',
    name: 'Left Psoas',
    color: '#00FFFF',
    threshold: [-29.0, 150.0],
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'right-psoas',
    name: 'Right Psoas',
    color: '#00FF15',
    threshold: [-29.0, 150.0],
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'wall-muscle',
    name: 'Wall Muscle',
    color: '#FF0000',
    threshold: [-29.0, 150.0],
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'subcutaneous-fat',
    name: 'Subcutaneous Fat',
    color: '#4800FF',
    threshold: [-190.0, -30.0],
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'visceral-fat',
    name: 'Visceral Fat',
    color: '#FFFF00',
    threshold: [-190.0, -30.0],
    area: 0.00,
    isSegmenting: false
  },
]

localStorage.setItem("layerTypes", JSON.stringify(layerTypes))