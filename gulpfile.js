var gulp = require('gulp'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),  //清空文件夹
    del = require('del'),
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),  //重命名
    concat = require('gulp-concat'), //合并文件
    postcss = require('gulp-postcss'),
    pxtorem = require('postcss-pxtorem'),
    autoprefixer = require('autoprefixer'),
    // px2rem = require('gulp-px2rem-plugin'),
    replace = require('gulp-replace'),
    // spritermith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'), 
    csso = require('gulp-csso'),  
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),  //js压缩
    eslint = require('gulp-eslint'), //js检查
    babel = require('gulp-babel'), //编译es6
    rev = require('gulp-rev'),  //对文件名加md5后缀
    revCollector = require('gulp-rev-collector'); //路径html替换
var project = 'novel';
var path = {
    css: {
        src: './' + project + '/src/less/**/*.less',
        dist: './' + project + '/dist/css'
    },
    js: {
        src: './' + project + '/src/js/**/*.js',
        dist: './' + project + '/dist/js'
    },
    img: {
        src: './' + project + '/src/img/**/*',
        dist: './' + project + '/dist/img'
    },
    html: {
        src: './' + project + '/src/**/**/*.html',
        dist: './' + project + '/dist/',
    }
};

// 处理css
gulp.task('css', function() {
    var processors = [
            pxtorem({
                rootValue: 75,
                unitPrecision: 5,
                propList: ['*','!font*']
            }),
            autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0', 'last 2 Explorer versions', 'last 3 Safari versions', 'Firefox >= 20', '> 5%'],
                cascade: true, //是否美化属性值 默认：true 像这样：//-webkit-transform: rotate(45deg);transform: rotate(45deg);
                remove: true //是否去掉不必要的前缀 默认：true 
            })
        ];
    gulp.src(path.css.src)
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(minifycss())
        .pipe(rename({
            basename: project,
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.css.dist))
});

//加md5
gulp.task('cssmd5', function() {
    var processors = [
            pxtorem({
                rootValue: 100,
            }),
            autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0', 'last 2 Explorer versions', 'last 3 Safari versions', 'Firefox >= 20', '> 5%'],
                cascade: true, //是否美化属性值 默认：true 像这样：//-webkit-transform: rotate(45deg);transform: rotate(45deg);
                remove: true //是否去掉不必要的前缀 默认：true 
            })
        ];
    gulp.src(path.css.src)
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(minifycss())
        .pipe(rename({
            basename: project,
            suffix: '.min'
        }))
        .pipe(rev())  //文件加md5
        .pipe(gulp.dest(path.css.dist))
        .pipe(rev.manifest())  //生成rev-manifest.json
        .pipe(gulp.dest('./' + project + '/rev/'))
});

//图片处理
gulp.task('img', function() {
    gulp.src(path.img.src)
    .pipe(imagemin({
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest(path.img.dist))
});

// js 转es6
gulp.task('es6', function() {
    gulp.src(path.js.src)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({
            basename: project,
        }))
        .pipe(gulp.dest(path.js.dist))
})

// js  不转es6
gulp.task('js', function() {
    gulp.src(path.js.src, {sourcemaps: true})
    .pipe(rename({
        basename: project,
    }))
    .pipe(gulp.dest(path.js.dist))
})

//复制文件
gulp.task('copy', function() {
    gulp.src(path.html.src)
    .pipe(gulp.dest(path.html.dist))
})

gulp.task('rev', function() {
    gulp.src(['./' + project + '/rev/*.json', path.html.src])
    .pipe(revCollector())                                   
    .pipe(gulp.dest('./' + project + '/dist/'))
})


// 清理文件
gulp.task('del', function() {
    return del(['./' + project + '/dist/'])
});

gulp.task('clean', function() {
    return gulp.src('./' + project + '/dist/', {read:false})
         .pipe(clean())
})

//监听文件
gulp.task('sign', function(cb){
    runSequence('del', 'copy', 'es6', 'css', 'img', cb);
})
//监听文件 加md5 
gulp.task('signmd', function(cb){
    runSequence('del', 'copy', 'es6', 'css', 'img', 'rev', cb);
})

gulp.task('watch', function() {
    gulp.watch(path.css.src, ['sign'])
})

gulp.task('watchmd', function() {
    gulp.watch(path.css.src, ['signmd'])
})
