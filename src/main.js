const $siteList = $('.siteList')
const $lastLi = $siteList.find('.lastLi')
const x = localStorage.getItem('x') // localStorage 里储存的只能是字符串
const xObject = JSON.parse(x) // 将字符串转化为对象

const hashMap = xObject || [
    {logo: 'M', url: 'https://developer.mozilla.org/'},
    {logo: 'J', url: 'https://juejin.cn/'},
    {logo: 'G', url: 'https://github.com/'},
];

const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '') // 删除 / 开头的内容
}

const render = () => {
    $siteList.find('li:not(.lastLi)').remove() // 找到所有<li>但不包括lastLi，全部删除
    hashMap.forEach((node, index) => { 
        const $li = $(`
        <li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="close">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
            </div>
        </li>`).insertBefore($lastLi);
        $li.on('click',()=>{
            window.open(node.url)
        })
        $li.on('click', '.close', (e)=>{
            e.stopPropagation() // 阻止冒泡
            hashMap.splice(index, 1)
            render()
        })
    });
}

render()

$('.addButton').on('click', ()=>{
    let url  = window.prompt('请输入要添加的网址', 'https://')
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url
    }
    console.log(url)
    hashMap.push({
        logo: simplifyUrl(url)[0], 
        url: url
    });
    render()
});

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap) // 将对象转化为字符串
    localStorage.setItem('x', string) 
}

$(document).on('keypress', (e) => {
    console.log(e)
    const {key} = e // key = e.key
    for (let i = 0; i < hashMap.length; i++){
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url)
        }
    }
})