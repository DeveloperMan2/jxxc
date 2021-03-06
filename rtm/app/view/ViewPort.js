/**
 * Created by LBM on 2017/7/27.
 */
Ext.define('rtm.view.ViewPort', {
    extend: "Ext.container.Viewport",
    xtype: 'jz-viewport',
    requires: [
        'Ext.layout.container.Border',
        'rtm.view.TopView',
        'rtm.view.MainView'

    ],
    layout: 'border',
    constrain: true,
    liquidLayout: false,
    initComponent: function () {
        this.items = [
            {
                region: 'north',
                xtype: "jz-topview",
                hidden: true
            },
            {
                region: 'center',
                xtype: "jz-mainview"
            }
        ]
        this.callParent();
    }
});