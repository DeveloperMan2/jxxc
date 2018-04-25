/**
 * Created by LBM on 2017/7/27.
 * 关于selected、init属性说明，所有模块都可以设置init=true，只能配置最后一个init=true的项目的selected=true（重点）
 */
Ext.define('jxxc.conf.SystemConfig', {
    //singleton: true,
    requires: [
        'Ext.form.field.Checkbox'
    ],

    //systemTitle: "水库巡查",
    systemTitle:"",
    esriMapVectorUrl:"http://localhost:6080/arcgis/rest/services/jiangxi/jiangxi2/MapServer",
    esriMapImgUrl:"http://localhost:6080/arcgis/rest/services/jiangxi/jiangxi2/MapServer",
//矢量地图分辨率数组
    resolutions: [ 0.043994562990939096,
        0.021997281495469548,
        0.010998640747734774,
        0.005499320373867387,
        0.0027496601869336935,
        0.00137483009346684675,
        0.000687415046733423375,
        0.0003437075233667116875,
        0.00017185376168335584375,
        0.000085926880841677921875,
        0.0000429634404208389609375,
        0.00002148172021041948046875,
        0.000010740860105209740234375,
        0.0000053704300526048701171875],
    //切片左上角点
    origin:[-400,400],
    //默认显示范围  左 下 右 上
    extentLeft:113.572696970468,
    extentBottom:24.487606414383,
    extentRight:118.482260921593,
    extentTop:30.0790331326058,
    systemLogo: "main-icon",
    serviceRootUrl: "http://127.0.0.1:8080/server/",
    rtmstateUrl:"http://localhost:8080/skxj/a/task/xjTaskStatistics/",
    rtmdataUrl:"http://localhost:8080/skxj/a/task/xjTask/",
    //rtmdataUrl:"http://localhost:8080/skxj/static/plugin/gis/resources/data/",
    rtmplesUrl:"http://localhost:8080/skxj/a/task/xjTaskTrail/",
    rtmhistorpahtUrl:"http://127.0.0.1:8080/rmt/",
    //主容器ID
    bodyContainerID: 'bodyContainerID',
    //浮动容器ID
    floatContainerID: 'floatContainerID',
    systemMenu: [
        {
            name: "二维地图",
            selected: false,
            init: true,
            type: "widget",
            key: "jz-menu-map",
            widgetId: 'jz-widget-map',
            url: "jz-mapview",
            parent: 'bodyContainerID',
            ui: "top-menu-ui",
            icon: "jz-menu-map-icon",
            mode: "cover",
            hide: true
        },
        {
            name: "实时巡检监控",
            selected: true,
            init: true,
            type: "widget",
            key: "jz-menu-rtm",
            widgetId: 'jz-widget-rtm',
            url: "jz-rtmview",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "jz-menu-rtm-icon",
            mode: "normal",
            hide: false,

            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: 500,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        }/*,
        {
            name: "历史回放",
            selected: true,
            init: true,
            type: "widget",
            key: "jz-menu-history",
            widgetId: 'jz-widget-history',
            url: "jz-historyview",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "jz-menu-history-icon",
            mode: "normal",
            hide: false,

            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: 300,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        },*/
        /*,
        {
            name: "路线调整",
            selected: false,
            init: false,
            type: "widget",
            key: "jz-menu-routes",
            widgetId: 'jz-widget-routes',
            url: "jz-routeeditview",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "jz-menu-route-icon",
            mode: "normal",
            hide: false,

            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: 300,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        }*/
    ]
});
/*PS:通过"singleton: true"属性设置类为单例之后，不能再通过new关键字创建类的实例。
* 是否设置为单例类视个人喜好定,为了简化，现在屏蔽单例设置,否则需要通过全类型路径“jxxc.conf.SystemConfig”
* 调用其中的配置信息。*/
var conf = new jxxc.conf.SystemConfig();