import { ID } from "../types";
import GAbstractRoot from "../expression/gExpression/GAbstractRoot";

export class Configuration {
    public constructor(
        public readonly id: ID,
        public readonly badPreference: number) { }
}

export interface AutoAdaption<ConfigurationT extends Configuration> {
    root?: GAbstractRoot;
    getAdaptedIds(): ID[];
    getPossibleConfigurations(id: ID): ConfigurationT[];
    applyConfiguration(configuration: ConfigurationT): void;
    applyConfigurations(configurations: ConfigurationT[]): void;
    resetAll(): any;
    resetConfiguration(configuration: ConfigurationT): void;
    resetConfigurations(configurations: ConfigurationT[]): void;
}

export default function autoAdapt<AutoAdaptionT extends AutoAdaption<any>>(root: GAbstractRoot, adaption: AutoAdaptionT) {
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
            const configPath = _autoAdapt(adaptedIds, [..._configPath, currConfig])
            !!configPath && adaption.resetConfigurations(configPath);
            return configPath
        }).filter(configPath => !!configPath) as Configuration[][];

        const { configPath: bestConfigPath } = configPaths
            .map(configPath => ({
                configPath,
                badPreferenceSum: configPath.reduce((val, { badPreference }) => val + badPreference, 0)
            }))
            .reduce((prev, curr) => curr.badPreferenceSum < prev.badPreferenceSum ? curr : prev);

        adaption.applyConfigurations(bestConfigPath)

        return bestConfigPath;
    }

    _autoAdapt(adaptedIds, []);
}
