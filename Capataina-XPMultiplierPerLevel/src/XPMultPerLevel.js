"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XPMultPerLevel {
    constructor() {
        this.xpmultincrease = 1; //the percentage per level your xp multiplier will increase. right now 1 level is 1%
    }
    postDBLoad(container) {
        const dbServer = container
            .resolve("DatabaseServer")
            .getTables().globals;
    }
    preAkiLoad(container) {
        const staticRMS = container.resolve("StaticRouterModService");
        const pHelp = container.resolve("ProfileHelper");
        this.logger = container.resolve("WinstonLogger");
        staticRMS.registerStaticRouter("XpPerLevel", [
            {
                url: "/client/game/start",
                action: (url, info, sessionID, output) => {
                    try {
                        this.PMCLevel = pHelp.getPmcProfile(sessionID).Info.Level;
                        this.SCAVLevel = pHelp.getScavProfile(sessionID).Info.Level;
                        this.PMCEXPMult =
                            pHelp.getPmcProfile(sessionID).Stats.ExperienceBonusMult;
                        this.SCAVEXPMult =
                            pHelp.getScavProfile(sessionID).Stats.ExperienceBonusMult;
                        this.PMCEXPMult = 1 + 0.01 * this.xpmultincrease * this.PMCLevel;
                        this.SCAVEXPMult =
                            1 + 0.01 * this.xpmultincrease * this.SCAVLevel;
                    }
                    catch (error) {
                        this.logger.error(error.message);
                    }
                    return output;
                },
            },
            {
                url: "/client/items",
                action: (url, info, sessionID, output) => {
                    try {
                        this.PMCLevel = pHelp.getPmcProfile(sessionID).Info.Level;
                        this.SCAVLevel = pHelp.getScavProfile(sessionID).Info.Level;
                        this.PMCEXPMult =
                            pHelp.getPmcProfile(sessionID).Stats.ExperienceBonusMult;
                        this.SCAVEXPMult =
                            pHelp.getScavProfile(sessionID).Stats.ExperienceBonusMult;
                        this.PMCEXPMult = 1 + 0.01 * this.xpmultincrease * this.PMCLevel;
                        this.SCAVEXPMult =
                            1 + 0.01 * this.xpmultincrease * this.SCAVLevel;
                    }
                    catch (error) {
                        this.logger.error(error.message);
                    }
                    return output;
                },
            },
        ], "aki");
    }
    calcPMCXPBoost(currentLevel, currentMultiplier, configMultiplier) {
        currentMultiplier = 1 + 0.01 * configMultiplier * currentLevel;
    }
    calcSCAVXPBoost(currentLevel, currentMultiplier, configMultiplier) {
        currentMultiplier = 1 + 0.01 * configMultiplier * currentLevel;
    }
}
module.exports = { mod: new XPMultPerLevel() };
