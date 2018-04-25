/**
 * Created by LBM on 2017/7/28.
 */
Ext.define('jxxc.view.LayersView', {
    extend: 'Ext.Container',

    //Uncomment to give this component an xtype
    xtype: 'jz-layersview',
    title: '常规地图',
    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit'
    ],
    layout: 'fit',
    initComponent: function () {
        this.items = [{
            xtype: 'container',
            html: '提示：此浮动面板加载的内容可作为其他模块公用的展示模块，可以为表格、列表、图片、视频等，窗口大小可以根据配置任意调整。',
            margin: '0 0 0 0'
        }]
        this.callParent();
    }
});