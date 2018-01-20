var gulp       = require('gulp'), // ���������� Gulp
	sass         = require('gulp-sass'), //���������� Sass �����,
	browserSync  = require('browser-sync'), // ���������� Browser Sync
	concat       = require('gulp-concat'), // ���������� gulp-concat (��� ������������ ������)
	uglify       = require('gulp-uglifyjs'), // ���������� gulp-uglifyjs (��� ������ JS)
	cssnano      = require('gulp-cssnano'), // ���������� ����� ��� ����������� CSS
	rename       = require('gulp-rename'), // ���������� ���������� ��� �������������� ������
	del          = require('del'), // ���������� ���������� ��� �������� ������ � �����
	imagemin     = require('gulp-imagemin'), // ���������� ���������� ��� ������ � �������������
	pngquant     = require('imagemin-pngquant'), // ���������� ���������� ��� ������ � png
	cache        = require('gulp-cache'), // ���������� ���������� �����������
	autoprefixer = require('gulp-autoprefixer');// ���������� ���������� ��� ��������������� ���������� ���������

gulp.task('sass', function(){ // ������� ���� Sass
	return gulp.src('app/sass/**/*.sass') // ����� ��������
		.pipe(sass()) // ����������� Sass � CSS ����������� gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // ������� ��������
		.pipe(gulp.dest('app/css')) // ��������� ���������� � ����� app/css
		.pipe(browserSync.reload({stream: true})) // ��������� CSS �� �������� ��� ���������
});

gulp.task('browser-sync', function() { // ������� ���� browser-sync
	browserSync({ // ��������� browserSync
		server: { // ���������� ��������� �������
			baseDir: 'app' // ���������� ��� ������� - app
		},
		notify: false // ��������� �����������
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // ����� ��� ����������� ����������
		'app/libs/jquery/dist/jquery.min.js', // ����� jQuery
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // ����� Magnific Popup
		])
		.pipe(concat('libs.min.js')) // �������� �� � ���� � ����� ����� libs.min.js
		.pipe(uglify()) // ������� JS ����
		.pipe(gulp.dest('app/js')); // ��������� � ����� app/js
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css') // �������� ���� ��� �����������
		.pipe(cssnano()) // �������
		.pipe(rename({suffix: '.min'})) // ��������� ������� .min
		.pipe(gulp.dest('app/css')); // ��������� � ����� app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']); // ���������� �� sass ������� � ����� sass
	gulp.watch('app/*.html', browserSync.reload); // ���������� �� HTML ������� � ����� �������
	gulp.watch('app/js/**/*.js', browserSync.reload);   // ���������� �� JS ������� � ����� js
});

gulp.task('clean', function() {
	return del.sync('dest'); // ������� ����� dist ����� �������
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // ����� ��� ����������� �� app
		.pipe(cache(imagemin({ // � ������������
		// .pipe(imagemin({ // ������� ����������� ��� �����������
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('dest/img')); // ��������� �� ���������
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src([ // ��������� ���������� � ���������
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dest/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // ��������� ������ � ���������
	.pipe(gulp.dest('dest/fonts'))

	var buildJs = gulp.src('app/js/**/*') // ��������� ������� � ���������
	.pipe(gulp.dest('dest/js'))

	var buildHtml = gulp.src('app/*.html') // ��������� HTML � ���������
	.pipe(gulp.dest('dest'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
