import fs from "fs"
import { log, rd, versionCmp } from "./utils"
import { DIR_WORKSHOP, MAX_BUILDS } from "./const"
import { DatabaseNode, BuildInfo } from "./class"
import { deleteFromRemote } from './remote'
import {args} from "../index";
const ini = require('ini')

function preprocessPA(name: string): boolean {
    let dir = DIR_WORKSHOP + "/" + name + "/release"
    //删除$PLUGINSDIR
    if (!fs.existsSync(dir + "/$PLUGINSDIR") || !rd(dir + "/$PLUGINSDIR")) {
        log("Error:Can't preprocess " + name + ":remove $PLUGINSDIR failed")
        return false
    }
    //删除Other
    if (!fs.existsSync(dir + "/Other") || !rd(dir + "/Other")) {
        log("Warning::Remove Other failed for " + name)
    }
    //删除help.html
    if (fs.existsSync(dir + "/help.html")) {
        try {
            fs.unlinkSync(dir + "/help.html")
        } catch (err) {
            log("Warning::Remove help.html failed for " + name)
        }
    }
    //删除App/readme.txt
    if (fs.existsSync(dir + "/App/readme.txt")) {
        try {
            fs.unlinkSync(dir + "/App/readme.txt")
        } catch (err) {
            log("Warning::Remove App/readme.txt failed for " + name)
        }
    }
    //修改pac_installer_log.ini
    let filePath = dir + "/App/AppInfo/pac_installer_log.ini"
    if (!fs.existsSync(filePath)) {
        log("Warning:pac_installer_log.ini not found,skipping modification for " + name)
        return true
    }
    let fileContent = ini.parse(fs.readFileSync(filePath).toString()).PortableApps.comInstaller
    if (!fileContent) {
        log("Error:Can't preprocess " + name + ":[PortableApps.comInstaller] not found in pac_installer_log.ini")
        return false
    }
    try {
        fileContent.Info2 = "This file was generated by the PortableApps.com Installer wizard and modified by the official PortableApps.com Installer TM Rare Ideas, LLC as the app was installed."
        fileContent.Run = "true"
        fileContent.InstallerVersion = fileContent.WizardVersion
        fileContent.InstallDate = fileContent.PackagingDate
        fileContent.InstallTime = fileContent.PackagingTime

        let final = "[PortableApps.comInstaller]\n" + ini.stringify(fileContent)
        fs.writeFileSync(filePath, final)
    } catch (err) {
        console.log(JSON.stringify(err))
        log("Error:Can't preprocess " + name + ":can't modify pac_installer_log.ini")
        return false
    }

    log("Info:Preprocessed " + name + " successfully")
    return true
}

function removeExtraBuilds(
    database: DatabaseNode,
    repo: string,
    category: string
): DatabaseNode {
    log("Info:Trying to remove extra builds")

    //builds去重
    let hashMap: any = {}
    let r: Array<BuildInfo> = []
    for (let i in database.builds) {
        let buildInfo: BuildInfo = database.builds[i]
        if (!hashMap.hasOwnProperty(buildInfo.version.toString())) {
            hashMap[buildInfo.version.toString()] = true
            r.push(buildInfo)
        }
    }
    database.builds = r
    if (r.length <= MAX_BUILDS) {
        log("Info:No needy for removal after de-weight")
        return database
    }

    //builds降序排列
    database.builds.sort((a, b) => {
        return 1 - versionCmp(a.version, b.version)
    });
    //删除多余的builds
    for (let i = 0; i < database.builds.length - MAX_BUILDS; i++) {
        let target = database.builds.pop()
        if (typeof target !== "undefined") {
            log("Info:Remove extra build " + repo + "/" + target.name)
            try{
                fs.unlinkSync(repo + "/" + target.name)
            }catch (e) {
                if(!args.hasOwnProperty("g")) log("Warning:Fail to delete local extra build " + target.name)
            }
            if (!deleteFromRemote(target.name, category)) {
                log("Warning:Fail to delete remote extra build " + target.name)
            }
        }
    }

    return database
}

export {
    preprocessPA,
    removeExtraBuilds
}