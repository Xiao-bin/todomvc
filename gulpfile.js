var gulp = require('gulp');//获取gulp对象
/*var gulpminHtml = require("gulp-minify-html");//压缩html
var gulpminImg = require("gulp-imagemin");  //压缩图片*/
var $ = require("gulp-load-plugins")(); //载入所有包
var open = require("open");  //open包用$获取不到

//处理Html
gulp.task('html', function() {
    gulp.src("src/*.html")     //读取html
        .pipe(gulp.dest("bulid"))   //复制到bulid文件夹中(开发环境)
        .pipe($.minifyHtml())    //压缩文件
        .pipe(gulp.dest("dev"))  //复制到dev文件中（生产环境）
        .pipe($.connect.reload());
});
//处理js
gulp.task('js', function() {
    gulp.src("src/js/*.js")     //读取html
  /*      .pipe($.concat("index.js")) //合并js到index.js中*/
        .pipe(gulp.dest("bulid/js"))   //复制开发环境
        .pipe($.uglify())    //压缩文件
        .pipe(gulp.dest("dev/js")) //复制到生产环境
        .pipe($.connect.reload());
});
//处理css
gulp.task('css', function() {
    gulp.src("src/css/*.css")     //读取html
        .pipe(gulp.dest("bulid/css"))   //复制到开发环境
        .pipe($.cssmin())    //压缩文件
        .pipe(gulp.dest("dev/css"))  //复制生产环境
        .pipe($.connect.reload());
});
//处理图片
gulp.task('image', function() {
    gulp.src("src/images/*")     //读取html
        .pipe(gulp.dest("bulid/images"))   //复制到bulid文件夹中(开发环境)
        .pipe($.imagemin())    //压缩文件
        .pipe(gulp.dest("dev/images"))  //复制到dev文件中（生产环境）
        .pipe($.connect.reload());
});
//删除文件夹
gulp.task("clean",function () {
    gulp.src(["bulid","dev"])
        .pipe($.clean());
});

//lib
gulp.task("lib",function () {
	gulp.src("node_modules/todomvc-app-css/*.css")
		.pipe(gulp.dest("bulid/css/"))
		.pipe(gulp.dest("dev/css/"));
	gulp.src("node_modules/todomvc-common/*.css")
		.pipe(gulp.dest("bulid/css/"))
		.pipe(gulp.dest("dev/css/"));
	gulp.src("node_modules/todomvc-common/*.js")
		.pipe(gulp.dest("bulid/js/"))
		.pipe(gulp.dest("dev/js/"));
    gulp.src("bower_components/**/dist/*.js")
        .pipe(gulp.dest("bulid/lib"))
        .pipe(gulp.dest("dev/lib"))
});

//总任务
gulp.task("bulid",["html","css","js","image","lib"]);

//自动更新跟浏览器自动刷新启动
gulp.task("server",function () {
    $.connect.server({
        root:"bulid" ,
        port:8080 ,
        livereload:true
    });

    open("http://localhost:8080");

    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/css/*.css', ['css']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/images/*', ['image']);
});

//默认启动
gulp.task("default",["server"]);
