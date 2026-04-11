type LEDcolor = "Red" | "Green" | "Blue" | "White";

type LEDConfigBasic =
    |{mode: "alwaysOFF"}
    |{mode: "alwaysON"; color: LEDcolor}
    |{mode: "momentarySwitch"; color: LEDcolor}

type LEDConfigExtra =
    |{mode: "alwaysOFF"}
    |{mode: "alwaysON"; color: LEDcolor}
    |{mode: "momentarySwitch"; color: LEDcolor}
    |{mode: "onWhenActive"; color: LEDcolor}

type RockerLayout_ON_OFF = "topON_bottomOFF" | "topOFF_bottomON";

type RockerLayout_UP_DOWN = "topUP_bottomDOWN" | "topDOWN_bottomUp";

type LongPressThreshold = 250 | 500 | 750 | 1000 | 1500;

type SwitchConfig =
    |{mode: "ToggleAtPress"}
    |{mode: "ToggleAtSwitch"; rockerUsage: RockerLayout_ON_OFF}

type DimmConfig =
    |{mode: "ToggleAtPress"; dimThreshold: LongPressThreshold}
    |{mode: "ToggleAtSwitch"; rockerUsage: RockerLayout_ON_OFF; dimThreshold: LongPressThreshold}

interface ShutterConfig {
    RockerLayout: RockerLayout_UP_DOWN;
    LongPressTreshold: LongPressThreshold;
}

type RockerConfig =
    |{mode: "Schalten"; function: SwitchConfig; led: LEDConfigExtra}
    |{mode: "Dimmen"; function: DimmConfig; led: LEDConfigExtra}
    |{mode: "Rolladen"; function: ShutterConfig; led: LEDConfigBasic}


interface SmartSwitchConfig {
    iD: string;
    RockerLeft: RockerConfig;
    RockerRight: RockerConfig;
}

const FirstSwitch: SmartSwitchConfig = {
    iD: "FirstSwitch",
    RockerLeft: {
        mode: "Schalten",
        function: {
            mode: "ToggleAtSwitch",
            rockerUsage: "topOFF_bottomON"
        },
        led: {
            mode: "alwaysOFF"
        }
    },
    RockerRight: {
        mode: "Schalten",
        function: {
            mode: "ToggleAtSwitch",
            rockerUsage: "topOFF_bottomON"
        },
        led: {
            mode: "alwaysOFF"
        }
    }
}
