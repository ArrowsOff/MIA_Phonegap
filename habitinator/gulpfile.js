var gulp 	= require('gulp');
var gutil	= require('gulp-util');
var bower 	= require('bower');
var sh		= require('shelljs');
var $ 		= require('gulp-load-plugins')({ camelize: true });

var project = {

    sass: {
    	src: 'app/scss/ionic.app.scss',//project.src + 'scss/ionic.app.scss',
    	watch: 'app/scss/**/*.scss', //project.src + 'scss/**/*.scss',
    	name: 'styles.css',
    	dest: 'www/'
    },
    scripts: {
    	src:  'app/js/**/*.js',
    	watch: 'app/js/**/*.js',
    	name: 'app.js',
    	dest: 'www/'
    },
    templates: {
    	src: 'app/templates/**/*.html',
    	dest:'www/templates/',
    	index: {
    		src: 'app/index.html',
    		dest: 'www/'
    	},
    	watch: ['app/templates/**/*.html', 'app/index.html']
    },
    images: {
    	src: 'app/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)',
    	dest: 'www/img/',
    	watch: 'app/img/**/*(*.png|*.jpg|*.jpeg|*.gif|*.svg)'
    }

};

gulp.task('default', ['styles', 'scripts']);

gulp.task('styles', function(done) {
    return gulp.src(project.sass.src)
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe(gutil.env.production ? $.minifyCss({
        	keepSpecialComments: 0
        }) : gutil.noop())
        .pipe($.rename(project.sass.name))
        .pipe(gulp.dest(project.sass.dest))
});

gulp.task('scripts-lint', function() {
    return gulp.src(project.scripts.src)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
})

gulp.task('scripts', ['scripts-lint'], function() {
    return gulp.src(project.scripts.src)
        .pipe($.concat(project.scripts.name))
        .pipe(gutil.env.production ? $.uglify() : gutil.noop())
        .pipe(gulp.dest(project.scripts.dest))
});

gulp.task('html', function(){
	gulp.src(project.templates.index.src)
		.pipe(gulp.dest(project.templates.index.dest));

	return gulp.src(project.templates.src)
		.pipe(gulp.dest(project.templates.dest));
});

gulp.task('images', function() {
	return gulp.src(project.images.src)
		.pipe(gulp.dest(project.images.dest));
});

gulp.task('watch', function() {
    gulp.watch(project.sass.watch, ['styles']);
    gulp.watch(project.scripts.watch, ['scripts']);
    gulp.watch(project.templates.watch, ['html']);
    gulp.watch(project.images.watch, ['images']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
