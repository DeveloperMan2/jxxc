/**
 * Created by LBM on 2017/7/28.
 */

var g = {
    v: {
        isInit: false,
        //系统主菜单项目
        sysMenuItems: [],
        //主容器
        mainContainer: null,
        //浮动容器
        floatContainer: null,
        //当前显示的模块布局参数
        currentFloatParams: null
    },
    fn: {
        //根据配置文件初始化系统主菜单项目
        initSystemMenu: function (view) {
            if (view && view.xtype == 'jz-topview') {
                var sysMenuCmp = view.down("segmentedbutton");
                var menus = conf.systemMenu;
                if (menus && menus.length > 0) {
                    //解析系统菜单配置参数
                    Ext.each(menus, function (rec) {
                        if (rec != null) {
                            var menuItem = Ext.create('Ext.button.Button', {
                                id: rec['key'],
                                text: rec['name'],
                                value: rec['url'],
                                pressed: rec['selected'],
                                /*scale: 'large',*/
                                hidden: rec['hide'],
                                iconCls: rec['icon'],
                                ui: rec['ui']
                            });
                            menuItem['widgetType'] = rec['type'];
                            menuItem['parent'] = rec['parent'];
                            menuItem['init'] = rec['init'];
                            menuItem['mode'] = rec['mode'];
                            menuItem['widgetId'] = rec['widgetId'];
                            menuItem['floatContainerParams'] = rec['floatContainerParams'];
                            g.v.sysMenuItems.push(menuItem);
                        }
                    });

                    if (sysMenuCmp) {
                        sysMenuCmp.removeAll();
                        sysMenuCmp.add(g.v.sysMenuItems);
                        sysMenuCmp.on('toggle', g.fn.toggleHandler);
                    }
                }
            }
        },
        loadWidget: function (widget) {
            var wType = widget['widgetType'];
            var wMode = widget['mode'];
            if (wType == 'widget') {
                if (wMode == 'cover') {
                    if (g.v.mainContainer == null) {
                        g.v.mainContainer = Ext.getCmp(widget['parent']);
                    }

                    //隐藏主容器中已加载的模块
                    if (g.v.mainContainer.items.items && g.v.mainContainer.items.items.length > 0) {
                        for (var i = 0; i < g.v.mainContainer.items.items.length; i++) {
                            var mWidget = g.v.mainContainer.items.items[i];
                            mWidget.hide();
                        }
                    }
                }
                else if (wMode == 'normal') {
                    var floatParams = widget['floatContainerParams'];

                    if (floatParams) {
                        g.v.currentFloatParams = floatParams;
                    }

                    //初始化浮动模块容器
                    g.fn.initFloatContainer(floatParams);

                    if (g.v.floatContainer) {
                        //清空浮动容器中已加载的常规模块
                        //g.v.floatContainer.removeAll();

                        //隐藏浮动容器中已加载的模块
                        if (g.v.floatContainer.items.items && g.v.floatContainer.items.items.length > 0) {
                            for (var i = 0; i < g.v.floatContainer.items.items.length; i++) {
                                var fWidget = g.v.floatContainer.items.items[i];
                                fWidget.hide();
                            }
                        }
                    }

                    if (g.v.floatContainer.hidden) {
                        g.v.floatContainer.show();
                    }
                }

                //加载新的模块,判断模块是否已经加载，有-显示，无-新建
                var wParent = widget['parent'];
                var tempWidget = null;
                if (g.v.mainContainer && wParent == conf.bodyContainerID) {
                    tempWidget = g.v.mainContainer.getComponent(widget['widgetId']);
                    if (tempWidget) {
                        tempWidget.show();
                    } else {
                        tempWidget = new Ext.create('widget.' + widget['value'], {id: widget['widgetId']});
                        g.v.mainContainer.add(tempWidget);
                    }

                    g.v.mainContainer.updateLayout();
                } else if (g.v.floatContainer && wParent == conf.floatContainerID) {
                    //清空浮动容器中模块
                    //tempWidget = new Ext.create('widget.' + widget['value'], {id: widget['widgetId']});
                    //g.v.floatContainer.add(tempWidget);

                    //不清空浮动容器中模块
                    tempWidget = g.v.floatContainer.getComponent(widget['widgetId']);
                    if (tempWidget) {
                        tempWidget.show();
                    } else {
                        tempWidget = new Ext.create('widget.' + widget['value'], {id: widget['widgetId']});
                        g.v.floatContainer.add(tempWidget);
                    }

                    //公用代码
                    /*g.v.floatContainer.setTitle(widget['text']);
                    g.v.floatContainer.setIconCls(widget['iconCls']);*/
                    g.v.floatContainer.updateLayout();
                }
            }
        },
        initWidget: function () {
            var menus = conf.systemMenu;
            if (menus && menus.length > 0) {
                Ext.each(menus, function (rec) {
                    if (rec != null) {
                        var widget = {};
                        widget['id'] = rec['key'];
                        widget['text'] = rec['name'];
                        widget['value'] = rec['url'];
                        widget['widgetType'] = rec['type'];
                        widget['parent'] = rec['parent'];
                        widget['init'] = rec['init'];
                        widget['widgetId'] = rec['widgetId'];
                        widget['mode'] = rec['mode'];
                        widget['iconCls'] = rec['icon'];
                        widget['hidden'] = rec['hide'];
                        widget['pressed'] = rec['selected'];
                        widget['floatContainerParams'] = rec['floatContainerParams'];
                        //如果有多个菜单init设置为true，默认全部加载，容器显示最后初始化的模块
                        if (rec['init']) {
                            g.fn.loadWidget(widget);
                            //return false;//退出当前循环
                        }
                    }
                });
            }
        },
        initFloatContainer: function (floatParams) {
            if (g.v.floatContainer == null) {
                g.v.floatContainer = new Ext.create('Ext.panel.Panel', {
                    width: 300,
                    height: 300,
                    x: 5,
                    y: 65,
                    // title: '浮动容器',
                    ui: 'float-panel',
                    layout: 'fit',
                    draggable: false,
                    collapsible: false,
                    collapseToolText: '隐藏',
                    expandToolText: "展开",
                    plain: true,
                    floating: true,
                    closable: false,
                    closeAction: 'hide',
                    //id: conf.floatContainerID,
                    bodyStyle: 'opacity:0.9; filter: Alpha(Opacity=90);',
                    renderTo: Ext.getBody()
                })
            }

            if (g.v.mainContainer == null) {
                g.v.mainContainer = Ext.getCmp(conf.bodyContainerID);
            }
            //如果浮动面板参数不为空，则设置面板参数，暂时实现四种方式，可以参照官方API完善扩展
            if (floatParams && g.v.mainContainer) {
                var w = floatParams['w'];
                var h = floatParams['h'];

                var align = floatParams['align'];
                var offsetX = floatParams['gapX'];
                var offsetY = floatParams['gapY'];

                if (typeof (w) == 'string' && w.indexOf('%') > -1) {
                    w = g.v.mainContainer.el.dom.clientWidth * parseFloat(w.substr(0, w.indexOf('%'))) / 100 - 2 * offsetX;
                }

                if (typeof (h) == 'string' && h.indexOf('%') > -1) {
                    h = g.v.mainContainer.el.dom.clientHeight * parseFloat(h.substr(0, h.indexOf('%'))) / 100 - 2 * offsetY;
                }

                g.v.floatContainer.setWidth(w);
                g.v.floatContainer.setHeight(h);

                switch (align) {
                    case 'tl': {
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'bl': {
                        offsetY = g.v.mainContainer.el.dom.clientHeight - offsetY - h;
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'tr': {
                        offsetX = g.v.mainContainer.el.dom.clientWidth - offsetX - w;
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'br': {
                        offsetX = g.v.mainContainer.el.dom.clientWidth - offsetX - w;
                        offsetY = g.v.mainContainer.el.dom.clientHeight - offsetY - h;
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                }
            }

            //默认隐藏
            g.v.floatContainer.hide();
        },
        toggleHandler: function (container, button, pressed) {
            if (pressed) {
                g.v.isInit = true;
                g.fn.loadWidget(button);
            }
        },
        changeDisplayMode: function (button, e, eOpts) {
            if (button['pressed']) {
                //进入全屏模式
                var tv = this.getTopView();
                tv.hide(true);

                g.fn.fullScreen();
            } else {
                //退出全屏模式
                var tv = this.getTopView();
                tv.show(true);

                g.fn.exitFullScreen();
            }
        },
        fullScreen: function () {
            var docElm = document.documentElement;
            //W3C
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }

            //FireFox
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }

            //Chrome等
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }

            //IE11
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        },

        exitFullScreen: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}

Ext.define('historyline.controller.Global', {
    extend: 'Ext.app.Controller',
    config: {
        //Uncomment to add references to view components
        refs: [
            {
                ref: 'mainView',
                selector: 'jz-main'
            }
        ],

        //Uncomment to listen for events from view components
        control: {
            'jz-main': {
                afterrender: function () {
                    g.fn.initFloatContainer();

                    if (!g.v.isInit) {
                        g.fn.initWidget();
                    }
                    else {
                        g.fn.initFloatContainer(g.v.currentFloatParams);
                        if (g.v.floatContainer.hidden) {
                            g.v.floatContainer.show();
                        }
                    }
                },
                afterlayout: function () {
                    if(g.v.currentFloatParams){
                        g.fn.initFloatContainer(g.v.currentFloatParams);
                        if (g.v.floatContainer.hidden) {
                            g.v.floatContainer.show();
                        }
                    }
                }
            },
            'button[action=fullScreen]': {
                click: g.fn.changeDisplayMode
            }
        }
    }
});
