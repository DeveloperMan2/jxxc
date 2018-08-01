/**
 * Created by LBM on 2017/7/28.
 */
var gv = {
    v: {
        globe: null,
        //场景控件是否已经初始化
        isGlobeAdded: false
    },
    fn: {
        initGlobe:function (globeid) {
            gv.v.globe = new Cesium.Viewer(globeid);
        }
    }
}
Ext.define('rtm.view.GlobeView', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype*/
    xtype: 'jz-globeview',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel'
    ],

    layout: 'fit',
    items: [{
        xtype: 'container',
        html: '<div id="cesiumContainerId" style="width: 100%;height: 100%;overflow: hidden;margin:0;position: relative;border: hidden;"></div>',
        margin: '0 0 0 0',
        listeners: {
            afterlayout: function () {
                if (!gv.v.isGlobeAdded) {
                    gv.v.isGlobeAdded = true;
                    gv.fn.initGlobe('cesiumContainerId');
                }
            }
        }
    }]
});