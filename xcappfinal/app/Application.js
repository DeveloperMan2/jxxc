/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('jxxc.Application', {
    extend: 'Ext.app.Application',

    name: 'jxxc',

    controllers: ["Global"],
    stores: [
        // TODO: add global / shared stores here
    ],
    requires: [
        'jxxc.conf.SystemConfig',
        'jxxc.utils.AjaxUtils',
        'jxxc.utils.CommonUtils'
    ],

    launch: function () {
        // TODO - Launch the application
        document.title = conf.systemTitle;
        var load = Ext.get('loading');
        if (load) {
            load.remove();//清除启动mask
        }

    },

    onAppUpdate: function () {
        Ext.Msg.confirm('应用升级', '当前应用已更新, 是否重新加载?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
