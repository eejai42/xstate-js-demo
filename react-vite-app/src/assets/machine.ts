import { setup, fromPromise } from "xstate";

export const machine = setup({
  delays: {
    TRANSITION_DELAY: 1000,
    PEDESTRIAN_DELAY: 2000,
  },
  types: {
    context: {} as { counter: number; NightProfile: boolean },
    events: {} as
      | { type: "done" }
      | { type: "terminate" }
      | { type: "Error" }
      | { type: "TICK" }
      | { type: "redTimerExpired" }
      | { type: "vehicleSensor" }
      | { type: "systemReset" },
  },
  actions: {
    logEnterGreen: function ({ context, event }, params) {
      console.info("Entering green state", context, event, params);
      // Add your action code here
      // ...
    },
    logExitGreen: function ({ context, event }, params) {
      console.info("Exiting green state", context, event, params);
      // Add your action code here
      // ...
    },
    incrementCounter: function ({ context, event }, params) {
      console.info("Incrementing counter", context, event, params);
      // Add your action code here
      // ...
    },
    doThisThatOrTheOther: function ({ context, event }, params) {
      console.info("Doing this that or the other", context, event, params);
      // Add your action code here
    },
  },
  actors: {
    timerService: fromPromise(async () => {
      // ...
    }),
  },
  guards: {
    isCounterReached: function ({ context, event }) {
      console.info("Checking if counter is reached", context, event);
      // Add your guard condition here
      return true;
    },
    isNightProfile: function ({ context, event }) {
      console.info("Checking if NightProfile is active", context, event);
      // Add your guard condition here
      return true;
    },
  },
}).createMachine({
  context: {
    counter: 0,
    NightProfile: false,
  },
  id: "expanded-traffic-system",
  type: "parallel",
  description:
    "Parallel traffic + pedestrian machine with an inline timer service.",
  states: {
    trafficOps: {
      initial: "green",
      invoke: {
        id: "expanded-traffic-system.trafficOps:invocation[0]",
        input: {},
        src: "timerService",
      },
      description:
        "Controls main traffic lights, uses an invoked timer service.",
      states: {
        green: {
          on: {
            done: {
              target: "orange",
            },
            terminate: {
              target: "finished",
            },
            Error: {
              target: "Flashing Redish",
            },
            TICK: {
              target: "orange",
              guard: {
                type: "isCounterReached",
              },
            },
          },
          after: {
            TRANSITION_DELAY: {
              target: "orange",
            },
          },
          description: "Green light. Eventually transitions to orange.",
        },
        orange: {
          on: {
            done: {
              target: "red",
            },
            terminate: {
              target: "finished",
            },
            Error: {
              target: "Flashing Redish",
            },
          },
          after: {
            TRANSITION_DELAY: {
              target: "red",
            },
          },
          description:
            "Orange (amber) light. After a short delay, transitions to red.",
        },
        finished: {
          type: "final",
          description: "Traffic operations complete.",
        },
        "Flashing Redish": {
          on: {
            systemReset: {
              target: "H",
            },
          },
          description:
            "Error mode. On systemReset, returns to last known sub-state via 'H'.",
        },
        red: {
          on: {
            redTimerExpired: {
              target: "green",
            },
            terminate: {
              target: "finished",
            },
            Error: {
              target: "Flashing Redish",
            },
            vehicleSensor: {
              target: "green",
              guard: {
                type: "isNightProfile",
              },
            },
          },
          after: {
            TRANSITION_DELAY: {
              target: "green",
            },
          },
          description:
            "Red light. Transitions to green if 'NightProfile' is active and vehicleSensor is triggered, or after a timer.",
        },
        H: {
          type: "history",
          history: "shallow",
        },
      },
    },
    pedestrianOps: {
      initial: "walk",
      description: "Cycles between 'walk' and 'dontWalk' signals on a delay.",
      states: {
        walk: {
          after: {
            PEDESTRIAN_DELAY: {
              target: "dontWalk",
            },
          },
        },
        dontWalk: {
          after: {
            PEDESTRIAN_DELAY: {
              target: "walk",
            },
          },
        },
      },
    },
  },
});