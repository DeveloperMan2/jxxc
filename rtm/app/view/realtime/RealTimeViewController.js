/**
 * Created by LBM on 2017/10/24.
 */
Ext.define('rtm.view.realtime.RealTimeViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.realtime',

    requires: [
        'Ext.button.Button'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    afterrenderHandler: function () {
      //  this.addBdMap('bdmap');
    },
    addBdMap: function (mapDiv) {
        var map = new BMap.Map(mapDiv, {minZoom: 4, maxZoom: 18});
        //修改地图显示范围，直接设置城市名称或坐标，地图显示比例尺
        map.centerAndZoom('江西', 9);
        //map.centerAndZoom(new BMap.Point(115.76472,27.79886),10);
        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));
        map.enableScrollWheelZoom(true);
        this.getViewModel().data.map = map;

        var id = this.getUrlParam('id');
        if (id != null) {
            var grid = Ext.getCmp("routPanel");
            var store = grid.getStore();
            var record = store.getAt(id);
          //  this.createPath(record);
         //   this.getViewModel().data.xcls.start();
            var f = function () {
                // var path = record.get('path');
                // var points = [];
                // if (path && path.length > 0) {
                //     Ext.each(path, function (node) {
                //         var np = new BMap.Point(node['x'], node['y']);
                //         points.push(np);
                //     });
                //     map.setViewport(points);
                // }
                grid.setSelection(record);
            }
            setTimeout(f, 500);
        }
    },
    getUrlParam:function(param) {
        var params = Ext.urlDecode(location.search.substring(1));
        return param ? params[param] : params;
    },
    locationHandler: function (grid, record, index, eOpts) {
        var item = grid.dataSource.data.items[0];
        if (item) {
            this.createPath(item);
        }
    },
    selectHandler: function (grid, record, index, eOpts) {
        if (record) {
            this.createPath(record);
        }
    },
    createPath: function (rec) {
        var map = mv.v.map;
        var vector = map.getLayer("currentMoveVector");
        if (vector == null) {
            vector = new SuperMap.Layer.Vector("currentMoveVector");
            vector.id = vector.name;
            map.addLayer(vector);
        }
        vector.removeAllFeatures();
        var path = rec.get('path');
        var points = [];
        var landmarkPois = [];
        var markers = [];
        var stepTime = 2;
        if (path && path.length > 0) {
            Ext.each(path, function (node) {
                var np = new SuperMap.Geometry.Point(node['x'], node['y']);
                points.push(np);
            });
            var line1 = new SuperMap.Geometry.LineString(points);
            var linecVector = new SuperMap.Feature.Vector(line1);
            linecVector.style={
                strokeColor:"#7B68EE",
                strokeWidth:2
            } ;
            vector.addFeatures(linecVector);
            // for (var i = 0; i < markers.length; i++) {
            //     map.addOverlay(new BMap.Marker(markers[i], {icon: icon1}));//覆盖巡查车站标注到地图上
            // }
            var extent = vector.getDataExtent();
            if (extent != null) {
                map.zoomToExtent(extent);
            }
          //  this.getViewModel().data.xcls = lushu;
        }
    },
    onPlayHandler: function () {
        if (this.getViewModel().data.xcls) {
            this.getViewModel().data.xcls.start();
        }
    },
    onPauseHandler: function () {
        if (this.getViewModel().data.xcls) {
            this.getViewModel().data.xcls.pause();
        }
    },
    onStopHandler: function () {
        if (this.getViewModel().data.xcls) {
            this.getViewModel().data.xcls.stop();
        }
    }
});