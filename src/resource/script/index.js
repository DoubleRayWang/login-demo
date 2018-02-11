$(function () {
    let clip = document.querySelector('.clip'),
        left = document.querySelector('.left'),
        right = document.querySelector('.right'),
        num = document.querySelector('.num'),
        rotate = 0;
    const time = 100;
    
    let loop = setInterval(() => {
        if (rotate >= 100) {
            rotate = 0;
            right.classList.add('width-none');
            clip.classList.remove('auto');
        } else if (rotate > 50) {
            right.classList.remove('width-none');
            clip.classList.add('auto');
        }
        rotate++;
        left.style.transform = 'rotate(' + 360/time * rotate + 'deg)';
        num.innerHTML = `${rotate}%`
    }, time)
    
    console.log(loop);
})
