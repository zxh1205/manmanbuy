setNowFontSize();

function setNowFontSize() {
    //标准屏幕宽度
    var StandardWidth = 375;
    //默认根元素大小为100px
    var StandardFontSize = 100;
    // 默认最大根元素大小为200px
    var maxFontSize = 200;
    // 获取屏幕当前宽度
    var nowWidth = document.documentElement.offsetWidth;
    // 计算当前字体大小
    var nowFontSize = nowWidth / StandardWidth * StandardFontSize;

    // 判断当前字体的大小,不能超过200px
    if(nowFontSize > maxFontSize){
        nowFontSize = maxFontSize;
    }
    document.documentElement.style.fontSize = nowFontSize + 'px';
}
// 当触发resize事件的时候,修改根元素的大小
window.addEventListener('resize', setNowFontSize);



