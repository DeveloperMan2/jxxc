/**
 * Created by LBM on 2017/8/2.
 */
Ext.define('rtm.view.TopView', {
    extend: 'Ext.panel.Panel',
    /*
    Uncomment to give this component an xtype*/
    xtype: 'jz-topview',
    ui: 'banner-panel-bgcolor',
    requires: [
        'Ext.Img',
        'Ext.button.Segmented',
        'Ext.container.Container',
        'Ext.form.Label',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel'
    ],
    height: 60,
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'center'
    },
    defaults: {
        border: false
    },

    items: [
        /* include child components here */
        {
            xtype: 'component',
            width: 10
        },
        {
            xtype: 'image',
            alt: "",
            width: 48,
            height: 48,
            cls: conf.systemLogo,
        },
        {
            xtype: 'component',
            width: 15
        },
        {
            xtype: 'label',
            html: conf.systemTitle,
            cls: 'sysTitle'
        },
        {
            flex: 1
        },
        {
            xtype: 'panel',
            ui: 'banner-panel-bgcolor',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    ui: 'banner-panel-bgcolor',
                    height: 20,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    }/*,
                    items: [
                        {
                            xtype: 'panel',
                            ui: 'banner-panel-bgcolor',
                            html: '<iframe width="600" scrolling="no" height="18" frameborder="0" allowtransparency="true" style="padding-left: 5px" src="http://i.tianqi.com/index.php?c=code&id=1&color=%23FFFFFF&icon=1&py=beijing&wind=1&num=2&site=12"></iframe>'/!*---北京天气*!/
                        }]*/
                },
                {flex: 1},
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [
                        {xtype: 'component', flex: 1},
                        {
                            xtype: 'segmentedbutton',
                            allowMultiple: false,
                            height: 40,
                            defaults: {
                                scale: 'large',
                                border: false
                            },
                            items: []
                        }
                    ]
                }
            ]
        }
    ]
})
;