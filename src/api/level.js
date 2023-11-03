const levels= [
  {
    "label": "一星",
    "value": 1
  },
  {
    "label": "二星",
    "value": 2
  },
  {
    "label": "三星",
    "value": 3
  }
]

export {
  levels
}
function simulateClick(x, y) {
  var event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': true,
    'clientX': x,
    'clientY': y
  });
  var element = document.elementFromPoint(x, y);
  element.dispatchEvent(event);
}



