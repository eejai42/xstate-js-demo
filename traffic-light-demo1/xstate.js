import { createMachine, assign } from "xstate";

export const machine = createMachine({
  context: {
    walkButtonPressed: false,
    rightTurnRequested: false,
  },
  id: "trafficLight",
  initial: "red",
  on: {
    PRESS_WALK: {
      actions: assign({ walkButtonPressed: true }),
    },
  },
  states: {
    red: {
      on: {
        TIMER: {
          target: "green",
        },
        PRESS_WALK: {
          actions: (context) => (context.walkButtonPressed = true),
        },
        PRESS_RIGHT_TURN: {
          actions: (context) => (context.rightTurnRequested = true),
        },
      },
      description:
        "The traffic light is red. Vehicles must stop, and pedestrians can press the walk button to request a walk signal.",
    },
    green: {
      on: {
        TIMER: [
          {
            target: "greenArrow",
            guard: ({ context }) => context.rightTurnRequested,
          },
          {
            target: "yellow",
          },
        ],
      },
      description:
        "The traffic light is green. Vehicles can go straight. If the right turn arrow was requested, it will turn on after the green light.",
    },
    greenArrow: {
      on: {
        TIMER: {
          target: "yellowArrow",
        },
      },
      entry: (context) => (context.rightTurnRequested = false),
      description:
        "The right turn arrow is green. Vehicles can make a right turn. The light will turn yellow next.",
    },
    yellow: {
      on: {
        TIMER: {
          target: "red",
        },
      },
      description:
        "The traffic light is yellow. Vehicles should prepare to stop. The light will turn red next.",
    },
    yellowArrow: {
      on: {
        TIMER: {
          target: "red",
        },
      },
      description:
        "The right turn arrow is yellow. Vehicles should prepare to stop turning. The light will turn red next.",
    },
    walk: {
      on: {
        TIMER: {
          target: "stop_now",
        },
      },
      description:
        "The pedestrian walk signal is on. Pedestrians can cross. The light will turn to stop next.",
    },
    stop_now: {
      on: {
        TIMER: {
          target: "red",
        },
      },
      description:
        "The pedestrian stop signal is on. Pedestrians should not cross. The light will turn red next.",
    },
  },
}).withConfig({
  guards: {},
});