;(function(){
	$.fn.autoBackgroundScroll = function(options) {
		var opts = $.extend({}, $.fn.autoBackgroundScroll.defaults, options);
		var $backslider = $(this);
		var duration = opts.duration;
		var speed = opts.speed;
		var imageWidth = opts.imageWidth;
		var imageHeight = opts.imageHeight;
		var direction1 = opts.direction1;
		var direction2 = opts.direction2;
		var posX = 0;
		var posY = 0;
		scroll(duration, speed, direction1, direction2);
		function scroll(duration, speed, direction1, direction2){
			setInterval(function(){
				if(direction1 == 'right'){
					moveRight();
					if(direction2 == 'top'){
						moveTop();
					}
					if(direction2 == 'bottom'){
						moveBottom();
					}
				} else if(direction1 == 'left'){
					moveLeft();
					if(direction2 == 'top'){
						moveTop();
					}
					if(direction2 == 'bottom'){
						moveBottom();
					}

				} else if(direction1 == 'bottom'){
					moveBottom();

					if(direction2 == 'right'){
						moveRight();
					}

					if(direction2 == 'left'){
						moveLeft();
					}

				} else if(direction1 == 'top'){
					moveTop();

					if(direction2 == 'right'){
						moveRight();
					}

					if(direction2 == 'left'){
						moveLeft();
					}

				}
                $backslider.css('background-position', posX + 'px ' + posY + 'px');
				function moveTop(){
					if(posY <= -imageHeight){
						posY = 0;
					}
					posY -= speed;
				}

				function moveRight(){
					if(posX >= imageWidth){
						posX = 0;
					}
					posX += speed;
				}

				function moveBottom(){
					if(posY >= imageHeight){
						posY = 0;
					}
					posY += speed;
				}

				function moveLeft(){
					if(posX <= -imageWidth){
						posX = 0;
					}
					posX -= speed;
				}

			}, duration);
		}

	}
	$.fn.autoBackgroundScroll.defaults = {
		direction1: 'right',
		direction2: '',
		duration: 1,
		speed: 0.5
	};
})(jQuery);