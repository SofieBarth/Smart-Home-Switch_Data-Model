// Possible colors for the integrated rocker LED
type LEDColor = "red" | "green" | "blue" | "white";

/**
 * Base LED configuration valid for all switch functions.
 * Note: alwaysOFF does not allow a color to be specified.
 */
type LEDConfigBasic =
    |{mode: "alwaysOFF"}
    |{mode: "alwaysON"; color: LEDColor}
    |{mode: "momentarySwitch"; color: LEDColor}

/**
 * Extended LED mode only available for switch and dim functions.
 * Mirrors the controlled light's state (on = LED on, off = LED off).
 */
type LEDConfigExtra =
    | LEDConfigBasic
    | { mode: "onIfActive"; color: LEDColor};

/** Rocker layout for on/off functions */
type RockerLayout_ON_OFF = "topON_bottomOFF" | "topOFF_bottomON";

/** Rocker layout for up/down functions of shutter */
type RockerLayout_UP_DOWN = "topUP_bottomDOWN" | "topDOWN_bottomUP";

/** Duration in ms after which a press is considered a long press */
type LongPressThresholdMS = 250 | 500 | 750 | 1000 | 1500;

/**
 * Configuration for the simple toggle function.
 * toggleAtPress: both rocker sides toggle the same output.
 * toggleAtSwitch: top and bottom rocker have dedicated on/off roles.
 */
type SwitchConfig =
    |{mode: "toggleAtPress"}
    |{mode: "toggleAtSwitch"; rockerUsage: RockerLayout_ON_OFF}

/**
 * Configuration for the dim function.
 * Short press toggles on/off, long press dims the light.
 */
type DimmConfig =
    |{mode: "toggleAtPress"; dimThresholdMS: LongPressThresholdMS}
    |{mode: "toggleAtSwitch"; rockerUsage: RockerLayout_ON_OFF; dimThresholdMS: LongPressThresholdMS}

/** Configuration for shutter control */
interface ShutterConfig {
    rockerLayout: RockerLayout_UP_DOWN;
    longPressThreshold: LongPressThresholdMS;
}

/**
 * Assigns a function to a single rocker.
 * shutterFunction is restricted to LEDConfigBasic since onIfActive
 * is not meaningful without an active state to mirror.
 */
type RockerAssignment =
    |{mode: "switchFunction"; function: SwitchConfig; led: LEDConfigExtra}
    |{mode: "dimFunction"; function: DimmConfig; led: LEDConfigExtra}
    |{mode: "shutterFunction"; function: ShutterConfig; led: LEDConfigBasic}

/** Full configuration for a smart switch with two independently configurable rockers */
interface SmartSwitchConfig {
    id: string;
    rockerLeft: RockerAssignment;
    rockerRight: RockerAssignment;
}

// Example: left rocker toggles a light, right rocker controls a shutter
const firstSwitch: SmartSwitchConfig = {
    id: "firstSwitch",
    rockerLeft: {
        mode: "switchFunction",
        function: {
            mode: "toggleAtSwitch",
            rockerUsage: "topOFF_bottomON"
        },
        led: {
            mode: "alwaysOFF"
        }
    },
    rockerRight: {
        mode: "shutterFunction",
        function: {
            rockerLayout: "topDOWN_bottomUP",
            longPressThreshold: 500
        },
        led: {
            mode: "alwaysON", color: "blue"
        }
    }
}
const secondSwitch: SmartSwitchConfig = {
    id: "secondSwitch",
    rockerLeft: {
        mode: "dimFunction",
        function: {
            mode: "toggleAtPress",
            dimThresholdMS: 750
        },
        led: {
            mode: "alwaysOFF"
        }
    },
    rockerRight: {
        mode: "switchFunction",
        function: {
            mode: "toggleAtSwitch",
            rockerUsage: "topON_bottomOFF"
        },
        led: {
            mode: "onIfActive",
            color: "green"
        }
    }
}

const thirdSwitch: SmartSwitchConfig = {
    id: "failConfig",
    rockerLeft: {
        mode: "dimFunction",
        function: {
            mode: "toggleAtPress",
            dimThresholdMS: 750
        },
        led: {
            mode: "alwaysOFF",
            color: "white"
        }
    },
    rockerRight: {
        mode: "switchFunction",
        function: {
            mode: "toggleAtSwitch",
            rockerUsage: "topON_bottomON"
        },
        led: {
            mode: "onIfActive"
        }
    }
}