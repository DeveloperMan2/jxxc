/**
 * Created by LBM on 2017/8/1.
 */
Ext.define('rtm.view.MainView', {
    extend: 'Ext.Container',

    //Uncomment to give this component an xtype
    xtype: 'jz-mainview',

    requires: [
        'Ext.layout.container.Fit',
        'rtm.view.FillView',
        'rtm.view.MapView',
        /*'rtm.view.HistoryView',*/
        /*'rtm.view.rtm.Rtm',
        'rtm.view.routeedit.RouteEditView',
        'rtm.view.realtime.RealTimeView',*/
        'rtm.view.rtm.Rtm'
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