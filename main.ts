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

/**
 * Defines the dimming behavior during a long press.
 * pressBrighterThenDimmer: each long press cycles brighter first, then dimmer.
 * rockerSideAssignment: top and bottom rocker have dedicated brighter/dimmer roles.
 */
type DimSettingsLongPress =
    | {mode: "pressToDimmerThanBrighter"}
    | {mode: "rockerSideAssignment", rockerLayout: RockerLayout_BIGHTER_DIMMER}


/** Rocker layout for brighter/dimmer functions */
type RockerLayout_BIGHTER_DIMMER = "topBRIGHTER_bottomDiMMER" | "topDIMMER_bottomBRIGHTER";

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
    |{mode: "rockerSideAssignment"; rockerUsage: RockerLayout_ON_OFF}

/**
 * Configuration for the dim function.
 * Short press toggles on/off, long press dims the light.
 * dimSettings defines whether dimming direction is fixed or rocker-side dependent.
 */
type DimConfig =
    |{mode: "toggleAtPress"; dimThresholdMS: LongPressThresholdMS; dimSettings: DimSettingsLongPress;}
    |{mode: "rockerSideAssignment"; rockerUsage: RockerLayout_ON_OFF; dimThresholdMS: LongPressThresholdMS; dimSettings: DimSettingsLongPress}

/** Configuration for shutter control */
type ShutterConfig = {
    rockerSideAssignment_UP_DOWN: RockerLayout_UP_DOWN;
    longPressThreshold: LongPressThresholdMS;
}

/**
 * Assigns a function to a single rocker.
 * shutterFunction is restricted to LEDConfigBasic since onIfActive
 * is not meaningful without an active state to mirror.
 */
type RockerAssignment =
    |{mode: "switchFunction"; function: SwitchConfig; led: LEDConfigExtra}
    |{mode: "dimFunction"; function: DimConfig; led: LEDConfigExtra}
    |{mode: "shutterFunction"; function: ShutterConfig; led: LEDConfigBasic}

/** Full configuration for a smart switch with two independently configurable rockers */
type SmartSwitchConfig = {
    id: string;
    rockerLeft: RockerAssignment;
    rockerRight: RockerAssignment;
}

// Example: left rocker for switch function, right rocker controls a shutter
const firstSwitch: SmartSwitchConfig = {
    id: "firstSwitch",
    rockerLeft: {
        mode: "switchFunction",
        function: {
            mode: "rockerSideAssignment",
            rockerUsage: "topOFF_bottomON"
        },
        led: {
            mode: "alwaysOFF"
        }
    },
    rockerRight: {
        mode: "shutterFunction",
        function: {
            rockerSideAssignment_UP_DOWN: "topDOWN_bottomUP",
            longPressThreshold: 1000,
        },
        led: {
            mode: "alwaysON", color: "blue"
        }
    }
}

// Example: left rocker controls a light with dim function, right rocker for switch function
const secondSwitch: SmartSwitchConfig = {
    id: "secondSwitch",
    rockerLeft: {
        mode: "dimFunction",
        function: {
            mode: "toggleAtPress",
            dimThresholdMS: 750,
            dimSettings: {
                mode: "rockerSideAssignment", rockerLayout: "topBRIGHTER_bottomDiMMER",
            }
        },
        led: {
            mode: "alwaysOFF"
        }
    },
    rockerRight: {
        mode: "switchFunction",
        function: {
            mode: "rockerSideAssignment",
            rockerUsage: "topON_bottomOFF"
        },
        led: {
            mode: "onIfActive",
            color: "green"
        }
    }
}
/*
// Example: left rocker controls a light with dim function, right rocker for switch function
// False configurations added
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
            mode: "rockerSideAssignment",
            rockerUsage: "topON_bottomON"
        },
        led: {
            mode: "onIfActive"
        }
    }
}
*/
