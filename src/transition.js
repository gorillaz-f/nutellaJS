
//过场动画的基类
;Eip.Transitions.Base = Backbone.Model.extend({
	initialize: function(options) {
		var self = this;

		self.options 	= options;
		self.cur 		= $(options.cur);
		self.next 		= $(options.next);
		self.width 		= options.width;
		self.height 	= options.height;
		self.direction 	= options.direction || 'left';
		self.onBegin 	= options.onBegin 	|| function(){};
		self.onEnd 		= options.onEnd 	|| function(){};
		self.duration 	= options.duration 	|| Eip.constants.pageTransitionDurationMS;
		self.className 	= options.className || "page";	 //非常关键的属性，表示container里面的页面的class

		self.viewport = $(self.cur.parent().parent());

	}
});


// 覆盖式的切换过场动画
// 新对象滑动进入,并将旧对象覆盖
;Eip.Transitions.Cover = Eip.Transitions.Base.extend({
	initialize: function(options) {
		var self = this;
		self.parentClass = Eip.Transitions.Base;
		self.parentClass.prototype.initialize.apply(self, arguments);
	},

	begin: function() {
		var self = this;

		var tempContainer = self.cur.parent();
		var offsetX = Number(tempContainer.attr("offsetx"));
		var offsetY = Number(tempContainer.attr("offsety"));

		$("." + self.className, self.viewport).hide();

		var startTransform = '';
		// from right to left
		if (self.direction === 'left') {
			startTransform =  Eip.utils.makeTranslate3DString(self.width - offsetX, -offsetY, 0);
		}
		// from left to right
		else if (self.direction === 'right') {
			startTransform =  Eip.utils.makeTranslate3DString(-self.width - offsetX, -offsetY, 0);
		}
		// from bottom to top
		else if (self.direction === 'up') {
			startTransform =  Eip.utils.makeTranslate3DString( - offsetX, self.height -offsetY, 0);
		}
		// from top to bottom
		else if (self.direction === 'down') {
			startTransform =  Eip.utils.makeTranslate3DString( - offsetX, -self.height -offsetY, 0);
		}

		// 新对象将处于Z轴1度位置，准备被执行切换动画入场
		self.next.css({
			'z-index': '1',
			'-webkit-transform': startTransform
		}).show();

		// 旧对象需保证处于z轴原点，能够被新对象覆盖
		self.cur.css({
			'z-index': '0'
		}).show();

		self.onBegin && self.onBegin();

		// 执行动画
		var endTransform = Eip.utils.makeTranslate3DString(-offsetX, -offsetY, 0);
		self.next.animate(
			//{'-webkit-transform': 'Translate3D(' + (-offsetX)+'px, ' +  (-offsetY)+'px, 0px)'},
			{'-webkit-transform': endTransform},
			self.duration,
			"ease-out",
			function() {
				//完成动画后，旧对象将被隐藏，避免增加dom渲染压力，提高性能
				self.cur.hide();
				//最后执行回调hook
				self.onEnd && self.onEnd();
			}
		)
	}
});


// 反覆盖式的切换过场动画
// 当前对象滑动退出，并将旧对象显露
;Eip.Transitions.Uncover = Eip.Transitions.Base.extend({
	initialize: function(options) {
		var self = this;
		self.parentClass = Eip.Transitions.Base;
		self.parentClass.prototype.initialize.apply(self, arguments);
	},

	begin: function() {
		var self = this;

		var tempContainer = self.cur.parent();
		var offsetX = Number(tempContainer.attr("offsetx"));
		var offsetY = Number(tempContainer.attr("offsety"));

		$("." + self.className, self.viewport).hide()

		self.next.css({
			'z-index': '0',
			'-webkit-transform': Eip.utils.makeTranslate3DString(-offsetX , -offsetY, 0)
		}).show();


		self.cur.css({
			'z-index': '1'
		}).show();


		self.onBegin && self.onBegin();

		var endTransform = '';
		if (self.direction === 'left') {
			endTransform =  Eip.utils.makeTranslate3DString(-self.width -offsetX , -offsetY, 0);
		} else if (self.direction === 'right') {
			endTransform = Eip.utils.makeTranslate3DString(self.width -offsetX , -offsetY, 0);
		} else if (self.direction === 'up') {
			endTransform = Eip.utils.makeTranslate3DString( -offsetX , -self.height -offsetY, 0);
		} else if (self.direction === 'down') {
			endTransform = Eip.utils.makeTranslate3DString( -offsetX , self.height -offsetY, 0);
		}


		self.cur.animate(
			{'-webkit-transform': endTransform},
			self.duration,
			"ease-out",
			function() {
				self.cur.hide();
				self.onEnd && self.onEnd();
			}
		)
	}
});


// 滑动式的切换过场动画
// 新旧两个对象同时滑动, 一个退出，一个进入
;Eip.Transitions.Slide = Eip.Transitions.Base.extend({
	initialize: function(options) {
		var self = this;
		self.parentClass = Eip.Transitions.Base;
		self.parentClass.prototype.initialize.apply(self, arguments);
	},

	begin: function() {
		var self = this;

		var tempContainer = self.cur.parent();
		var offsetX = Number(tempContainer.attr("offsetx"));
		var offsetY = Number(tempContainer.attr("offsety"));

		$("." + self.className, self.viewport).hide()

		var startTransform, endTransform;

		if (self.direction === 'left') {
			startTransform	= Eip.utils.makeTranslate3DString( self.width-offsetX , 0-offsetY, 0);
			endTransform	= Eip.utils.makeTranslate3DString( 0-self.width+offsetX , 0+offsetY , 0);
		}
		else if (self.direction === 'right') {
			startTransform	= Eip.utils.makeTranslate3DString( 0-self.width-offsetX , 0-offsetY , 0);
			endTransform	= Eip.utils.makeTranslate3DString( self.width+offsetX , 0+offsetY , 0);
		}
		else if (self.direction === 'up') {
			startTransform	= Eip.utils.makeTranslate3DString( 0-offsetX , self.height-offsetY , 0);
			endTransform	= Eip.utils.makeTranslate3DString( 0+offsetX , 0-self.height+offsetY , 0);
		}
		else if (self.direction === 'down') {
			startTransform	= Eip.utils.makeTranslate3DString( 0-offsetX , 0-self.height-offsetY , 0);
			endTransform	= Eip.utils.makeTranslate3DString( 0+offsetX , self.height+offsetY , 0);
		}

		self.cur.css({
			'z-index': '0'
		}).show();

		self.next.css({
			'z-index': '1',
			'-webkit-transform': startTransform
		}).show();

		setTimeout(function() {
			self.onBegin && self.onBegin();

			tempContainer.animate(
				{ '-webkit-transform' : endTransform },
				self.duration,
				"ease-out",
				function() {
					var offset = tempContainer.position();
					tempContainer.attr('offsetx', offset.left);
					tempContainer.attr('offsety', offset.top);
					//alert(offset.left + "/// " + offset.top);
					self.onEnd && self.onEnd();
				}
			);
		}, 0);
	}
});
