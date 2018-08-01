/**
 * Created by LBM on 2017/10/24.
 */
Ext.define('rtm.view.routeedit.RouteEditViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.editroute',

    requires: [
        'Ext.button.Button'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    snap01:null,
    modifyFeature:null,
    afterrenderHandler: function () {
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
    updateLnVector:function(event) {
        var routeLnVector = mv.v.map.getLayer("routeLn");

        var routePtVector = mv.v.map.getLayer("routePt");
        if (routePtVector != null && routeLnVector != null) {
            routeLnVector.removeAllFeatures();

            var points = [];
            Ext.each(routePtVector.features, function (features) {
                points.push(features.geometry);
            });
            var line1 = new SuperMap.Geometry.LineString(points);
            var linecVector = new SuperMap.Feature.Vector(line1);
            linecVector.style={
                strokeColor:"#7B68EE",
                strokeWidth:2
            };
            routeLnVector.addFeatures(linecVector);
        }
    },
    createPath: function(rec) {
        var map = mv.v.map;
        if (this.modifyFeature != null) {
            this.modifyFeature.deactivate();
        }

        var routeLnVector = map.getLayer("routeLn");
        if (routeLnVector == null) {
            routeLnVector = new SuperMap.Layer.Vector("routeLn");
            routeLnVector.id = routeLnVector.name;
            map.addLayer(routeLnVector);
        }
        routeLnVector.removeAllFeatures();

        var routePtVector = map.getLayer("routePt");
        if (routePtVector == null) {
            routePtVector = new SuperMap.Layer.Vector("routePt");
            routePtVector.id = routePtVector.name;
            map.addLayer(routePtVector);
            routePtVector.events.on({"afterfeaturemodified":this.updateLnVector});

            this.snap01=new SuperMap.Snap([routePtVector],4,2,{actived:true});
            //矢量要素编辑控件
            this.modifyFeature = new SuperMap.Control.ModifyFeature(routePtVector);
            this.modifyFeature.snap = this.snap01;
            map.addControl(this.modifyFeature);
            //激活 modifyFeature 控件
        }
        routePtVector.removeAllFeatures();
        this.modifyFeature.activate();

        var path = rec.get('path');
        var points = [];
        var landmarkPois = [];
        var markers = [];
        var stepTime = 2;
        if (path && path.length > 0) {
            Ext.each(path, function (node) {
                var np = new SuperMap.Geometry.Point(node['x'], node['y']);
                var ptV =new SuperMap.Feature.Vector(np);
                ptV.style={
                    strok:'false',
                    fillColor:'#FF0000',
                    fillOpacity:0.7,
                    pointRadius:8,
                    strokeLinecap:'round'
                } ;
                routePtVector.addFeatures(ptV);
                points.push(np);
            });
            var line1 = new SuperMap.Geometry.LineString(points);
            var linecVector = new SuperMap.Feature.Vector(line1);
            linecVector.style={
                strokeColor:"#7B68EE",
                strokeWidth:2
            };
            routeLnVector.addFeatures(linecVector);
            var extent = routePtVector.getDataExtent();
            if (extent != null) {
                map.zoomToExtent(extent);
            }
        }
    }
});