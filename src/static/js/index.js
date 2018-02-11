'use strict';

$(function () {
    var clip = document.querySelector('.clip'),
        left = document.querySelector('.left'),
        right = document.querySelector('.right'),
        num = document.querySelector('.num'),
        rotate = 0;
    var time = 100;

    var loop = setInterval(function () {
        if (rotate >= 100) {
            rotate = 0;
            right.classList.add('width-none');
            clip.classList.remove('auto');
        } else if (rotate > 50) {
            right.classList.remove('width-none');
            clip.classList.add('auto');
        }
        rotate += 1;
        left.style.transform = 'rotate(' + 360 / time * rotate + 'deg)';
        num.innerHTML = rotate + '%';
    }, time);

    console.log(loop);
});
//# sourceMappingURL=index.js.map
