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

let layerTypes = [
  {
    id: 'left-psoas',
    name: 'Left psoas',
    color: '#00FFFF',
    threshold: [-29.0, 150.0],
    endpoint: '/api/segment?type=psoas_muscle',
    endpointToolType: '1',
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'right-psoas',
    name: 'Right psoas',
    color: '#00FF15',
    threshold: [-29.0, 150.0],
    endpoint: '/segment?type=psoas_muscle',
    endpointToolType: '1',
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'wall-muscle',
    name: 'Total muscle',
    color: '#FF0000',
    threshold: [-29.0, 150.0],
    endpoint: '/segment?type=lumbar_muscle',
    endpointToolType: '0',
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'subcutaneous-fat',
    name: 'Subcutaneous fat',
    color: '#4800FF',
    threshold: [-190.0, -30.0],
    endpoint: '/segment?type=subcut_fat',
    endpointToolType: '0',
    area: 0.00,
    isSegmenting: false
  },
  {
    id: 'visceral-fat',
    name: 'Visceral fat',
    color: '#FFFF00',
    threshold: [-190.0, -30.0],
    endpoint: '/segment?type=visceral_fat',
    endpointToolType: '0',
    area: 0.00,
    isSegmenting: false
  },
]

// Do not edit below this line
if (localStorage.getItem('layerTypes') !== null) {
  layerTypes = JSON.parse(localStorage.getItem('layerTypes'))
}
  
localStorage.setItem("layerTypes", JSON.stringify(layerTypes))