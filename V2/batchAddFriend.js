// 批量加好友 - 独立启动脚本
let module;
try {
    module = require("./modules/module.js");
    if (!module) throw new Error("模块导入结果为空");
} catch (error) {
    console.error("模块导入失败:", error);
    toast("模块导入失败，请检查module.js文件");
    exit();
}

let config = module.config;
let configs = storages.create("config");

try {
    module.createWindow(config.showText);
} catch (error) {
    console.error("创建窗口失败:", error);
}

// 读取用户填写的好友编号，逗号分隔
let friendIdsText = configs.get("batchAddFriend_ids", "");
if (!friendIdsText || friendIdsText.trim() === "") {
    toastLog("未填写好友编号");
    exit();
}
let addFriendsList = friendIdsText.split(",").map(s => s.trim()).filter(s => s.length > 0);

sleep(100);
module.checkmenu();
sleep(500);

// 判断是否需要切换账号，复用config.accountList的done勾选
if (!config.switchAccount || config.accountList.filter(account => account.done).length <= 1) {
    log("不切换账号");
    module.addFriends(addFriendsList);
    sleep(500);
    module.find_close();
} else {
    log("切换账号");
    const doneAccountsList = config.accountList.filter(account => account.done === true);
    doneAccountsList.forEach(account => {
        module.switch_account(account.title);
        log("============当前账号: " + account.title + "============");

        module.addFriends(addFriendsList);
        sleep(500);
        module.find_close();
    });
}

toastLog("批量加好友完成");
module.showTip("批量加好友完成");