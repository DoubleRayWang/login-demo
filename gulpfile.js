let gulp = require('gulp'),
    babel = require('gulp-babel'),
    notify = require('gulp-notify'),  //报错与不中断当前任务
    less = require('gulp-less'),//编译less
    sass = require('gulp-sass'),//编译less
    autoprefixer = require('gulp-autoprefixer'),//css自动加前缀
    plumber = require('gulp-plumber'),  //处理管道崩溃问题
    sequence = require("gulp-sequence"),//顺序执行
    minImage = require("gulp-imagemin"),//图片压缩
    rename = require('gulp-rename'),//文件重命名
    minImageForPng = require("imagemin-pngquant"),//图片压缩（png）
    htmlmini = require('gulp-html-minify'),//压缩html
    uglify = require('gulp-uglify'),//压缩js
    csso = require('gulp-csso'),//压缩优化css
    rev = require("gulp-rev"),//MD5版本号
    revFormat = require('gulp-rev-format'),
    revReplace = require('gulp-rev-replace'),
    del = require('del'),
    base64 = require('gulp-base64'),
    zip = require('gulp-zip'),
    _replace = require('gulp-replace'),
    sourcemaps = require('gulp-sourcemaps');//生成文件映射


/*
* src: 原始的开发目录，暂时包括less及es6的编译（es6限制打包类功能，如需更丰富的功能可移步webpack）
* static: 编译后未作为发布资源的暂时目录（有map文件），主要供调试
* dist: 发布版本的一级目录
* CustomDirectory：自定义发布版本的资源输出目录，可实现一套方案多项目使用，无需考虑复杂的目录结构
* topDirectory: 如果资源输出目录和页面的访问目录不同，则可使用此变量调节目录层级
* */
let src = {
        css: 'src/resource/css/',
        script: 'src/resource/script/'
    },
    static = 'src/static/',
    dist = 'dist/',
    CustomDirectory = 'resource/',
    topDirectory = '';
// H5 开发
//topDirectory = '../',
//CustomDirectory = 'Resource/HTML5/projectName/';


//MD5版本号

gulp.task('rev', function () {
    return gulp.src([static + '**/*.*', '!**/*.map'])
        .pipe(rev())
        .pipe(revFormat({
            prefix: '.',
            suffix: '.cache',
            lastExt: false
        }))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest('manifest/'));
});
gulp.task('revHtml', ['rev'], function () {
    let manifest = gulp.src(["./manifest/rev-manifest.json"]);
    
    function modifyUnreved(filename) {
        return filename;
    }
    
    function modifyReved(filename) {
        // filename是：index.69cef10fff.cache.css的一个文件名
        // gulp-rev-format的作用做正则匹配，
        if (filename.indexOf('.cache') > -1) {
            // 通过正则和relace得到版本号：69cef10fff
            const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
            // 把版本号和gulp-rev-format生成的字符去掉，剩下的就是原文件名：index.css
            const _filename = filename.replace(/\.[\w]*\.cache/, "");
            // 重新定义文件名和版本号：index.css?v=69cef10fff
            filename = _filename + "?v=" + _version;
            // 返回由gulp-rev-replace替换文件名
            return topDirectory + CustomDirectory + filename;
            // 可自由定制路径
        }
        return filename;
    }
    
    gulp.src([static + '*.html'])
        .pipe(_replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g, "$1"))
        .pipe(revReplace({
            manifest: manifest,
            modifyUnreved: modifyUnreved,
            modifyReved: modifyReved
        }))
        .pipe(gulp.dest(dist));
});


//压缩js
gulp.task('minJs', function () {
    return gulp.src(static + 'js/*.js')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(dist + CustomDirectory + 'js'));
});
//压缩图片
gulp.task('minImage', function () {
    return gulp.src(static + 'img/*.{png,jpg,gif,ico}')
        .pipe(minImage({
            progressive: true,
            use: [minImageForPng()]
        }))
        .pipe(gulp.dest(dist + CustomDirectory + 'img'));
});
gulp.task('minCss', function () {
    return gulp.src(static + 'css/*.css')
    //.pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(gulp.dest(dist + CustomDirectory + 'css'));
});
gulp.task('copy-lib', function () {
    return gulp.src(static + 'lib/**/*')
        .pipe(gulp.dest(dist + CustomDirectory + 'lib'))
})

gulp.task('del', function (cb) {
    return del(["dist"], cb) // 构建前先删除dist文件里的旧版本
})

//编译less
gulp.task('less', function () {
    return gulp.src(src.css + '*.less')  //找到需要编译的less文件
        .pipe(plumber({errorHandler: notify.onError('Error:<%= error.message %>;')}))  //如果less文件中有语法错误，用notify插件报错，用plumber保证任务不会停止
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(less())  //如果没错误，就编译less
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(base64({
            maxImageSize: 8 * 1024,               // 只转8kb以下的图片为base64
        }))
        //.pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(static + 'css'));  //把css文件放到css文件夹下
});

//编译sass
gulp.task('sass', function () {
    return gulp.src(src.css + '*.scss')  //找到需要编译的scss文件
        .pipe(plumber({errorHandler: notify.onError('Error:<%= error.message %>;')}))  //如果less文件中有语法错误，用notify插件报错，用plumber保证任务不会停止
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass())  //如果没错误，就编译sass
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(base64({
            maxImageSize: 8 * 1024,               // 只转8kb以下的图片为base64
        }))
        //.pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(static + 'css'));  //把css文件放到css文件夹下
});


gulp.task('babel', function () {
    return gulp.src(src.script + '*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(static + 'js'));
});


gulp.task("start", ['less', 'sass', 'babel'], function () {
    gulp.watch(src.css + '**/*.less', ['less']);
    gulp.watch(src.css + '**/*.scss', ['sass']);
    gulp.watch(src.script + '**/*.js', ['babel']);
    console.log('开始监听less/sass及ES6...');
});

//正式构建
gulp.task("default", ['del'], sequence(
    //编译、压缩文件
    ['start'], ['minJs', 'minImage', 'minCss'],
    //copy
    ['copy-lib'],
    //MD5版本号、版本替换
    ['revHtml']
));
gulp.task('zip', function () {
    gulp.src('dist')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'))
})