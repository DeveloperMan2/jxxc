/**
 * Created by LBM on 2017/8/1.
 */
Ext.define('jxxc.view.MainView', {
    extend: 'Ext.Container',

    //Uncomment to give this component an xtype
    xtype: 'jz-mainview',

    requires: [
        'Ext.layout.container.Fit',
        'jxxc.view.FillView',
        'jxxc.view.MapView',
        /*'jxxc.view.HistoryView',*/
        /*'jxxc.view.rtm.Rtm',
        'jxxc.view.routeedit.RouteEditView',
        'jxxc.view.realtime.RealTimeView',*/
        'jxxc.view.rtm.Rtm'
    ],
    layout: 'fit',
    initComponent: function () {
        this.items = [
            {
                id: conf.bodyContainerID,
                xtype: 'jz-fillview'
            }
        ]
        this.callParent();
    }
});