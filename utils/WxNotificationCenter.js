var __notices = [];
/**
 * addNotification
 * 注册通知对象方法
 * 
 * 参数:
 * name： 注册名，一般let在公共类中
 * selector： 对应的通知方法，接受到通知后进行的动作
 * observer: 注册对象，指Page对象
 */
function addNotification(name, selector, observer) {
    if (name && selector) {
        if (!observer) {
            console.log("addNotification Warning: no observer will can't remove notice");
        }
        console.log("addNotification:" + name);
        var newNotice = {
            name: name,
            selector: selector,
            observer: observer
        };
        addNotices(newNotice);
    } else {
        console.log("addNotification error: no selector or name");
    }
}

function addNotices(newNotice) {
    __notices.push(newNotice);
}

/**
 * removeNotification
 * 移除通知方法
 * 
 * 参数:
 * name: 已经注册了的通知
 * observer: 移除的通知所在的Page对象
 */
function removeNotification(name, observer) {
    console.log("removeNotification:" + name);
    for (var i = 0; i < __notices.length; i++) {
        var notice = __notices[i];
        if (notice.name === name) {
            if (notice.observer === observer) {
                __notices.splice(i, 1);
                return;
            }
        }
    }
}

/**
 * postNotificationName
 * 发送通知方法
 * 
 * 参数:
 * name: 已经注册了的通知
 * info: 携带的参数
 */

function postNotificationName(name, info) {
    console.log("postNotificationName:" + name);
    if (__notices.length == 0) {
        console.log("postNotificationName error: u hadn't add any notice.");
        return;
    }
    for (var i = 0; i < __notices.length; i++) {
        var notice = __notices[i];
        if (notice.name === name) {
            notice.selector(info);
        }
    }

}

module.exports = {
    addNotification: addNotification,
    removeNotification: removeNotification,
    postNotificationName: postNotificationName
}