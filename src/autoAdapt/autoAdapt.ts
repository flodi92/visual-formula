import { ID } from "../types";
import GExpression from "../expression/gExpression/GExpression";

export class Configuration {
    public constructor(
        public readonly id: ID,
        public readonly badPreference: number) { }
}

export interface AutoAdaption<ConfigurationT extends Configuration> {
    root?: GExpression;
    getAdaptedIds(): ID[];
    getPossibleConfigurations(id: ID): ConfigurationT[];
    applyConfiguration(configuration: ConfigurationT): void;
    applyConfigurations(configurations: ConfigurationT[]): void;
    resetAll(): any;
    resetConfiguration(configuration: ConfigurationT): void;
    resetConfigurations(configurations: ConfigurationT[]): void;
}

export default function autoAdapt<AutoAdaptionT extends AutoAdaption<any>>(root: GExpression, adaption: AutoAdaptionT) {
    adaption.root = root;
    adaption.resetAll()

    const adaptedIds = adaption.getAdaptedIds();

    const _autoAdapt = (_adaptedIds: ID[], _configPath: Configuration[]): Configuration[] | undefined => {
        if (!_adaptedIds.length) return _configPath;

        const [adaptedId, ...adaptedIds] = _adaptedIds;
        const possibleConfigs = adaption.getPossibleConfigurations(adaptedId);

        if (!possibleConfigs?.length) return undefined;

        const configPaths = possibleConfigs.map(currConfig => {
            adaption.applyConfiguration(currConfig);
            const configPath = _autoAdapt(adaptedIds, [..._configPath, currConfig]);
            adaption.resetConfiguration(currConfig);
            return configPath
        }).filter(configPath => !!configPath) as Configuration[][];

        if (!configPaths.length) return undefined;

        const { configPath: bestConfigPath } = configPaths
            .map(configPath => ({
                configPath,
                badPreferenceSum: configPath.reduce((val, { badPreference }) => val + badPreference, 0)
            }))
            .reduce((prev, curr) => curr.badPreferenceSum < prev.badPreferenceSum ? curr : prev);
            
        return bestConfigPath;
    }
        
        const bestConfigPath = _autoAdapt(adaptedIds, []);
        bestConfigPath && adaption.applyConfigurations(bestConfigPath)
}
