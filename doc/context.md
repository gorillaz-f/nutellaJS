Context
===================


Context即上下文管理器，类似一个容器，管理各个需要被展示的部件。在nut中，最基础的Context是PageContext，用于存储、管理、调度各个Page实例。

----------


PageContext
-------------

此容器提供的外部API有：

#### (1) getPageInst(pageName, options)
获取页实例，实例是要从nut已登记的页类库中创建，譬如
```
// DemoPageView 这个Page已经登记在nut的Pages下，并已经声明类的实现
nut.Pages.DemoPageView = ……
// 则可被创建实例
var demopage = context.getPageInst('DemoPageView');
// 由于TestPageView没有登记，这里会抛出运行时的异常
var testpage = context.getPageInst('TestPageView');
```

> **参数：**
> @pageName，是页类名的字符串描述。页类名在nut中有一个命名规则：XxxPageView，即应该以PageView结尾。如果参数没有遵循规则命名，则方法中会自动填充后再获取对应的实例。

> @options，是动态参数集，由每个页对象自己定义的创建初始化需要的参数

最后getPageInst方法返回一个PageView对象

#### (2) addPage(pageView)
添加页实例到容器中。注意此方法和getPageInst的区别，后者只是创建一个实例，但没有加入容器管理中，此方法则是将已经创建的页实例加入容器管理。
> **参数：**
> @pageView，已创建的页实例，容器将保存这个实例的引用。

#### (3) removePage(pageView)
从容器中删除页实例。这里会先调用一个beforeRemovePage的hook，开发者可以自定义一些删除页的预处理工作，如果没有则可以不实现这个hook方法，或者更保险地赋予空方法。预处理后，会先清除dom，然后从容器中清除。
> **参数：**
> @pageView，需要被删除的页实例，容器已保存这个实例的引用。

#### (4) getPageById( pageId )
通过ID获取页实例的引用。

#### (5) getHomePage()
获取上下文中的首页，默认是第一个加入Context的页，可以被修改。

#### (6) setHomePage(pageView)
设置上下文的首页


另外，PageContext还定义了4个接口，需要子类实现：

```
	addAndShowPage(pageView);
	hideAndRemovePage(pageView);
	goToPageView(pageView);
	goHome();
```


PhonePageContext
-------------

nut提供一个基于PageContext扩展的PhonePageContext实现。开发者实际可以根据自己项目的需要，扩展实现其他PageContext，但需要实现PageContext的接口。

PhonePageContext，将Page简单理解为完全填充手机屏幕显示的一个模块，所有Page的切换，都是全屏切换的，而且是栈式切换。

PhonePageContext，没有提供额外API和接口。
