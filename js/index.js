const input = document.querySelector('.autocomplete__input')

function App(){
    
    let timeout

   input.addEventListener('input', (e) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        
        let value = e.target.value.trim()
        if(value.length !== 0) getData(value)
        
    }, 180)
  })
}

const getData = async (text) => {
    
    const res = await fetch( `https://api.github.com/search/repositories?q=${text}&sort=stars`)
    const json = await res.json()
    const data = await json.items

    let matches = data.filter(item => {
        const regex = new RegExp(`^${text}`, 'gi')
        return item.name.match(regex)
    })

    createSearchList(matches)
    input.addEventListener('input', (e) => {
        if(e.target.value === ''){
            let visible = document.querySelector('.visible')
            clearList(visible)
        }
    })
 
}

function createSearchList(arr){
    
    const wrap = document.querySelector('.autocomplete')
    let check = wrap.children
    
    if(check.length > 0){
        wrap.removeChild(check[0])
    }

    let list = createElement('ul', 'autocomplete__list')
    
    if(arr.length > 0){
        for(let i = 0; i < 5; i++){
          let listItem = document.createElement('li')
          listItem.textContent = arr[i].name
          list.appendChild(listItem)
          let owner = arr[i].owner.login
          let stars = arr[i].stargazers_count
          listItem.addEventListener('click', () => {
              addToWatchList(arr[i].name, owner, stars)
              clearList(list)
              input.value = ''
          })
        }
    }else return
 
    list.classList.add('visible')
    wrap.appendChild(list)  
}

function addToWatchList(name, owner, stars){
    const resultList = document.querySelector('.result__list') 
    let resultItem = createElement('div', 'result__content')
    let propList = createElement('ul', 'content__list')
    let btn = createElement('button', 'btn')

    let html = `
    <li>Name: ${name}</li>
    <li>Owner: ${owner}</li>
    <li>Stars: ${stars}</li>
    `
    propList.innerHTML = html
    resultItem.appendChild(propList)
    resultItem.appendChild(btn)
    resultList.appendChild(resultItem)

    btn.addEventListener('click', () => { 
        resultList.removeChild(btn.parentNode)
    })
}

function createElement(tagName, className){
    const element = document.createElement(tagName)
    if(className){
        element.classList.add(className)
    }
    return element
}

function clearList(list){
    let arr = list.querySelectorAll('li')
    arr.forEach(item => 
        list.removeChild(item)    
    )
}

App()
     






















