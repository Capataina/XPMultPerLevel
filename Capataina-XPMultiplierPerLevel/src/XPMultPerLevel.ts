import { DependencyContainer } from "@spt-aki/models/external/tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

class XPMultPerLevel implements IPreAkiLoadMod, IPostDBLoadMod {
  public xpmultincrease = 1; //the percentage per level your xp multiplier will increase. right now 1 level is 1%

  private PMCLevel: number;
  private SCAVLevel: number;
  private PMCEXPMult: number;
  private SCAVEXPMult: number;
  private logger: ILogger;

  postDBLoad(container: DependencyContainer): void {
    const dbServer = container
      .resolve<DatabaseServer>("DatabaseServer")
      .getTables().globals;
  }

  preAkiLoad(container: DependencyContainer): void {
    const staticRMS = container.resolve<StaticRouterModService>(
      "StaticRouterModService"
    );
    const pHelp = container.resolve<ProfileHelper>("ProfileHelper");
    this.logger = container.resolve<ILogger>("WinstonLogger");
    staticRMS.registerStaticRouter(
      "XpPerLevel",
      [
        {
          url: "/client/game/start",
          action: (url: any, info: any, sessionID: any, output: any) => {
            try {
              this.PMCLevel = pHelp.getPmcProfile(sessionID).Info.Level;
              this.SCAVLevel = pHelp.getScavProfile(sessionID).Info.Level;

              this.PMCEXPMult =
                pHelp.getPmcProfile(sessionID).Stats.ExperienceBonusMult;
              this.SCAVEXPMult =
                pHelp.getScavProfile(sessionID).Stats.ExperienceBonusMult;

              this.calcPMCXPBoost(
                this.PMCLevel,
                this.PMCEXPMult,
                this.xpmultincrease
              );
              this.calcSCAVXPBoost(
                this.SCAVLevel,
                this.SCAVEXPMult,
                this.xpmultincrease
              );
            } catch (error) {
              this.logger.error(error.message);
            }
            return output;
          },
        },
        {
          url: "/client/items",
          action: (url: any, info: any, sessionID: any, output: any) => {
            try {
              this.PMCLevel = pHelp.getPmcProfile(sessionID).Info.Level;
              this.SCAVLevel = pHelp.getScavProfile(sessionID).Info.Level;

              this.PMCEXPMult =
                pHelp.getPmcProfile(sessionID).Stats.ExperienceBonusMult;
              this.SCAVEXPMult =
                pHelp.getScavProfile(sessionID).Stats.ExperienceBonusMult;

              this.calcPMCXPBoost(
                this.PMCLevel,
                this.PMCEXPMult,
                this.xpmultincrease
              );
              this.calcSCAVXPBoost(
                this.SCAVLevel,
                this.SCAVEXPMult,
                this.xpmultincrease
              );
            } catch (error) {
              this.logger.error(error.message);
            }
            return output;
          },
        },
      ],
      "aki"
    );
  }

  private calcPMCXPBoost(
    currentLevel: number,
    currentMultiplier: number,
    configMultiplier: number
  ) {
    currentMultiplier = 1 + 0.01 * configMultiplier * currentLevel;
  }
  private calcSCAVXPBoost(
    currentLevel: number,
    currentMultiplier: number,
    configMultiplier: number
  ) {
    currentMultiplier = 1 + 0.01 * configMultiplier * currentLevel;
  }
}

module.exports = { mod: new XPMultPerLevel() };
