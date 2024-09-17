// adding battery type:

interface NavigatorBattery extends Navigator {
    getBattery(): Promise<BatteryManager>;
}

interface BatteryManager {

    readonly charging: boolean;
    readonly chargingTime: number;
    readonly dischargingTime: number;
    readonly level: number;
    onchargingchange:(( this: BatteryManager, ev: Event) => any) | null;
    onchargingtimechange:(( this: BatteryManager, ev: Event) => any) | null;
    ondischchargingtimechange: (( this: BatteryManager, ev: Event) => any) | null;
    onlevelchange: (( this: BatteryManager, ev: Event) => any);

}




// adding connection type:

interface NavigatorConnection extends Navigator {
    readonly connection: NetworkInformation;
}

interface NetworkInformation {

    readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
    readonly downLink: number;
    readonly rtt: number;
    readonly saveData: boolean;

}


interface Navigator extends NavigatorBattery {
    readonly connection?: NetworkInformation
}