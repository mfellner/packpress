export function loadJSON(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.onreadystatechange = function(evt) {
      if (req.readyState === 4) {
        if (req.status === 200) {
          const obj = JSON.parse(req.responseText)
          resolve(obj)
        } else {
          const err = new Error(req.responseText)
          err.code = req.status
          reject(err)
        }
      }
    }
    req.send(null)
  })
}
