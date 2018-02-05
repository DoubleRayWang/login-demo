var gulp = require('gulp'),
    babel = require('gulp-babel'),
    notify = require('gulp-notify'),  //报错与不中断当前任务
    less = require('gulp-less'),//编译less
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

var src = {
        less: 'src/resource/less/',
        script: 'src/resource/script/'
    }


//MD5版本号

gulp.task('rev', function () {
    return gulp.src(['src/static/**/*.*', '!**/*.map'])
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
    var manifest = gulp.src(["./manifest/rev-manifest.json"]);
    
    function modifyUnreved(filename) {
        return filename;
    }
    
    function modifyReved(filename) {
        // filename是：admin.69cef10fff.cache.css的一个文件名
        // 在这里才发现刚才用gulp-rev-format的作用了吧？就是为了做正则匹配，
        if (filename.indexOf('.cache') > -1) {
            // 通过正则和relace得到版本号：69cef10fff
            const _version = filename.match(/\.[\w]*\.cache/)[0].replace(/(\.|cache)*/g, "");
            // 把版本号和gulp-rev-format生成的字符去掉，剩下的就是原文件名：admin.css
            const _filename = filename.replace(/\.[\w]*\.cache/, "");
            // 重新定义文件名和版本号：admin.css?v=69cef10fff
            filename = _filename + "?v=" + _version;
            // 返回由gulp-rev-replace替换文件名
            return filename;
        }
        return filename;
    }
    
    gulp.src(['src/*.html'])
        .pipe(_replace(/(\.[a-z]+)\?(v=)?[^\'\"\&]*/g, "$1"))
        .pipe(revReplace({
            manifest: manifest,
            modifyUnreved: modifyUnreved,
            modifyReved: modifyReved
        }))
        .pipe(gulp.dest('dist'));
});


//压缩js
gulp.task('minJs', function () {
    return gulp.src('src/static/js/*.js')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        //.pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/static/js'));
});
//压缩图片
gulp.task('minImage', function () {
    return gulp.src('src/static/img/*.{png,jpg,gif,ico}')
        .pipe(minImage({
            progressive: true,
            use: [minImageForPng()]
        }))
        .pipe(gulp.dest('dist/static/img'));
});
gulp.task('minCss', function () {
    return gulp.src('src/static/css/*.css')
    //.pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(gulp.dest('dist/static/css'));
})

/*gulp.task('default', ['del'], function () {
    var jsFilter = filter('src/static/!**!/!*.js', {restore: true}),
        cssFilter = filter('src/static/!**!/!*.css', {restore: true}),
        htmlFilter = filter(['src/!**!/!*.html'], {restore: true});
    //console.log(jsFilter,cssFilter)
    return gulp.src('src/!*.html')
        .pipe(useref())                         // 解析html中的构建块
        .pipe(jsFilter)                         // 过滤出所有js
        .pipe(uglify())                         // 压缩js
        .pipe(jsFilter.restore)// 返回到未过滤执行的所有文件
        .pipe(cssFilter)                        // 过滤所有css
        .pipe(csso())                           // 压缩优化css
        .pipe(cssFilter.restore)// 返回到未过滤执行的所有文件
        .pipe(RevAll.revision({                 // 生成版本号
            dontRenameFile: ['.html'],          // 不给 html 文件添加版本号
            dontUpdateReference: ['.html'],      // 不给文件里链接的html加版本号
            transformFilename: function (file, hash) {
                var ext = path.extname(file.path);
                return hash.substr(0, 5) + '.'  + path.basename(file.path, ext) + ext; // 3410c.filename.ext
            }
        }))
        .pipe(htmlFilter)                       // 过滤所有html
        //.pipe(htmlmini())                       // 压缩html
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest('dist'))
})*/

gulp.task('del', function (cb) {
    return del(["dist"], cb) // 构建前先删除dist文件里的旧版本
})

//编译less
gulp.task('less', function () {
    return gulp.src(src.less + '*.less')  //找到需要编译的less文件
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
        .pipe(gulp.dest('src/static/css'));  //把css文件放到css文件夹下
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
        .pipe(gulp.dest('src/static/js'));
});


gulp.task("start", ['less', 'babel'], function () {
    gulp.watch(src.less + '**/*.less', ['less']);
    gulp.watch(src.script + '**/*.js', ['babel']);
    console.log('开始监听less及script...');
});

//正式构建
gulp.task("default", ['del'], sequence(
    //编译、压缩文件
    ['start'], ['minJs', 'minImage', 'minCss'],
    //MD5版本号、版本替换
    ['rev'], ['revHtml']
));
gulp.task('zip', function () {
    gulp.src('dist')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('dist'))
})