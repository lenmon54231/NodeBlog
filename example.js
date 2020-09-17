
const createPromise = function(message) {
  const promise = new Promise(function(resolve, reject){
      setTimeout(function(){
          if(message) {
              /*1.*/ resolve(message)
          } else {
              reject("No Message Provided")
          }
      }, 0)
  })
  return promise
}

const someFunction = async function() {
  const promise = createPromise("Hello Async")
  const toReturn = await promise

  return "The Promise Returned: " + toReturn
}

result = someFunction()
console.log(result)